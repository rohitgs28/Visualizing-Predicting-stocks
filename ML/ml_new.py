#!C:\Users\Mathew\Anaconda3\python.exe

import quandl
import numpy as np
from datetime import datetime
import datetime,time
from sklearn import linear_model
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn.metrics import mean_squared_error
from math import sqrt
import cgi, cgitb 
import json
import sys,os

data=[]
date1=[]
final_date=[]
close = []
opening_prices = []
High_prices = []
Low_prices = []
closing_prices_list=[]
openning_prices_list=[]
High_prices_list=[]
Low_prices_list=[]
final_date_list=[]
date_list3=[]
slised_price=[]
sliced_date=[]
price_test=[]
date_test=[]
price_training=[]
date_training=[]
date2=[]
final_date=[]
prdeicted_values=[]
closingPredictedStockPrice=""

cgitb.enable()
def to_integer(dt_time):
	return time.mktime(dt_time.timetuple())

def google_stocks(myTicker):
	quandl.ApiConfig.api_key = "M5HWLF9jXDTrXrcWnpEe"
	data = quandl.get_table('WIKI/PRICES', qopts = { 'columns': ['ticker', 'date', 'close','open','high','low','Volume'] }, ticker = [myTicker], date = { 'gte': '2017-06-01', 'lte': '2017-12-31' })
	for index in data['date']:
		intDate = to_integer(index)
		date1.append(datetime.datetime.fromtimestamp(intDate).strftime('%d-%b-%Y'))
	for index in data['close']:
		closing_prices_list.append(float(index))
	for index in data['open']:
		openning_prices_list.append(float(index))
	for index in data['high']:
		High_prices_list.append(float(index))
	for index in data['low']:
		Low_prices_list.append(float(index))
	i=0
	for row in date1:
		final_date_list.append(i)
		i=i+1


def training_model(final_date_list,closing_prices_list):
	prdeicted_values=[]
	price_test=[]
	date_test=[]
	date_training=[]
	price_training=[]
	
	date_training1=[]
	price_training1=[]
	percentage_count= 0.8 *len(closing_prices_list)
	percentage_count =int(round(percentage_count))
	i=0
	while(i<=percentage_count):
		date_training.append(final_date_list[i])
		price_training.append(closing_prices_list[i])
		i=i+1
	i=percentage_count
	while(i<=percentage_count+4):
		date_test.append(final_date_list[i])
		price_test.append(closing_prices_list[i])
		i=i+1
	date_training=map(int,date_training)
	price_training=map(float,price_training)
	
	date_training_list=list(date_training)
	price_training_list=list(price_training)
	#
	#prediction logic begins here
	#
	
	date_training_list = np.reshape(date_training_list, (len(date_training_list),1)) 
	price_training_list = np.reshape(price_training_list, (len(list(price_training_list)),1))
	linear_mod = linear_model.LinearRegression()
	linear_mod.fit(date_training_list,price_training_list)
	StockPriceFornextperiod = linear_mod.predict(len(final_date_list)+1)[0][0]
	prdeicted_values.append(linear_mod.predict(len(price_training_list)+1)[0][0])
	prdeicted_values.append(linear_mod.predict(len(price_training_list)+2)[0][0])
	prdeicted_values.append(linear_mod.predict(len(price_training_list)+3)[0][0])
	prdeicted_values.append(linear_mod.predict(len(price_training_list)+4)[0][0])
	prdeicted_values.append(linear_mod.predict(len(price_training_list)+5)[0][0])
	return prdeicted_values,price_test,StockPriceFornextperiod
	
def evaluate(true_value,predict_value):
	# print(true_value)
	# print(predict_value)
	rms=sqrt(mean_squared_error(true_value,predict_value))
	diff=abs(true_value[0] - predict_value[0])
	value=diff/true_value[0]
	value=100-(value*100)
	#print value
	#accuracy =accuracy_score(true_label,predict_label)
	return rms,value
	
def predict(dates,price):
	price_test=[]
	prdeicted_values1=[]
	prdeicted_values2=[]
	price_test1=[]
	price_test2=[]
	predicted_price1,price_test,stockprice =training_model(dates,price)
	map(float,price_test)
	map(float,predicted_price1)
	for index in price_test:
		price_test1.append(format(index, '.2f'))
	for index in predicted_price1:
		prdeicted_values1.append(format(index, '.2f'))
	price_test2 = map(float,price_test1)
	prdeicted_values2 = map(float,prdeicted_values1)
	# print(price_test2)
	# print(prdeicted_values2)
	price_test2=list(price_test2)
	prdeicted_values2=list(prdeicted_values2)
	
	rms,accuracy = evaluate(price_test2,prdeicted_values2)
	return stockprice,rms,accuracy

try:
	inputValues = cgi.FieldStorage()
	companyName = inputValues.getvalue('name')
	google_stocks(companyName)
	actual_price=[]
	closingstockpredictprice,closingrms,closingaccuracy=predict(final_date_list,closing_prices_list)
	openstockpredictprice,openrms,openaccuracy=predict(final_date_list,openning_prices_list)
	lowstockpredictprice,lowrms,lowaccuracy=predict(final_date_list,Low_prices_list)
	Highstockpredictprice,highrms,highaccuracy=predict(final_date_list,High_prices_list)
	
	objClosing={"PredictedPrice":closingstockpredictprice,"RMS":closingrms,"Accuracy":closingaccuracy,"Data":closing_prices_list}
	objOpening={"PredictedPrice":openstockpredictprice,"RMS":openrms,"Accuracy":openaccuracy,"Data":openning_prices_list}
	objLow={"PredictedPrice":lowstockpredictprice,"RMS":lowrms,"Accuracy":lowaccuracy,"Data":Low_prices_list}
	objHigh={"PredictedPrice":Highstockpredictprice,"RMS":highrms,"Accuracy":highaccuracy,"Data":High_prices_list}

	
	objResponse={"Close":objClosing,"Open":objOpening,"Low":objLow,"High":objHigh}
	# predicted_price1=training_model(final_date_list,closing_prices_list)
	response={"dates":date1,"values":objResponse}
	
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'success', 'response':json.dumps(response)}))

except Exception as e:
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'error', 'except':json.dumps(e)}))
	