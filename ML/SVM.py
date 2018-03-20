#!C:\Users\Mathew\Anaconda3\python.exe

import csv
import numpy as np
from sklearn.svm import SVR
import matplotlib.pyplot as plt
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
from sklearn.svm import SVR
import json
import cgi, cgitb

from sklearn.model_selection import train_test_split

prediction_linear=[]
prediction_poly=[]
prediction_rbf=[]

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

cgitb.enable()
def to_integer(dt_time):
	return time.mktime(dt_time.timetuple())

def google_stocks(myTicker):
	quandl.ApiConfig.api_key = "M5HWLF9jXDTrXrcWnpEe"
	data = quandl.get_table('WIKI/PRICES', qopts = { 'columns': ['ticker', 'date', 'close','open','high','low','Volume'] }, ticker = [myTicker], date = { 'gte': '2017-08-01', 'lte': '2017-12-31' })
	for index in data['date']:
		intDate = to_integer(index)
		date1.append(datetime.datetime.fromtimestamp(intDate).strftime('%d-%b-%Y'))
	date2=map(str,date1)
	for index in data['close']:
		closing_prices_list.append(float(index))
	for index in data['open']:
		openning_prices_list.append(float(index))
	for index in data['high']:
		High_prices_list.append(float(index))
	for index in data['low']:
		Low_prices_list.append(float(index))
	i=0
	for row in date2:
		final_date_list.append(i)
		i=i+1

def evaluate(dates,prices,x,classifier):
	price_test=[]
	date_test=[]
	date_training=[]
	price_training=[]
	percentage_count=(0.8*len(prices))
	percentage_count =int(round(percentage_count)) 
	i=0
	while(i<=percentage_count):
		date_training.append(dates[i])
		price_training.append(prices[i])
		i=i+1
	i=percentage_count
	while(i<=percentage_count+ 10):
		date_test.append(dates[i])
		price_test.append(prices[i])
		i=i+1 
	# converting to matrix of n X 1
	date_training = np.reshape(date_training,(len(date_training), 1))  
	date_test = np.reshape(date_test,(len(date_test), 1))    
	if(classifier=='linear'):
		svr_lin_train = SVR(kernel= 'linear', C= 1e3)
		svr_lin_train.fit(date_training, price_training) 
		predict_value= svr_lin_train.predict(len(price_training)+1)[0]
		actual_value=price_test[0]
		#print predict_value
		#print actual_value
		diff=abs(actual_value - predict_value)
		value=diff/actual_value
		value=100-(value*100)
		#print value
		svr_lin = SVR(kernel= 'linear', C= 1e3)
		svr_lin.fit(date_test, price_test) 
		Stock_predicted_value=svr_lin.predict(x)[0]
	if(classifier=='sigmoid'):
		svr_poly_train = SVR(kernel= 'sigmoid')
		svr_poly_train.fit(date_training, price_training) 
		predict_value= svr_poly_train.predict(len(price_training)+1)[0]
		actual_value=price_test[0]
		#print predict_value
		#print actual_value
		diff=abs(actual_value - predict_value)
		value=diff/actual_value
		value=100-(value*100)
		#print value
		svr_poly = SVR(kernel= 'sigmoid')
		svr_poly.fit(date_test, price_test) 
		Stock_predicted_value=svr_poly.predict(x)[0]
	if(classifier=='rbf'):      
		svr_rbf_train = SVR(kernel= 'rbf', C= 1e3)
		svr_rbf_train.fit(date_training, price_training) 
		predict_value= svr_rbf_train.predict(len(price_training)+1)[0]
		actual_value=price_test[0]
		#print predict_value
		#print actual_value
		diff=abs(actual_value - predict_value)
		value=diff/actual_value
		value=100-(value*100)
		#print value
		svr_rbf = SVR(kernel= 'rbf', C= 1e3)
		svr_rbf.fit(date_test, price_test) 
		Stock_predicted_value=svr_rbf.predict(x)[0]
	return Stock_predicted_value,value

try:
	inputValues = cgi.FieldStorage()
	companyName = inputValues.getvalue('name')
	classifier = inputValues.getvalue('Classifier')
	google_stocks(companyName)
	# classifier="sigmoid"
	Stock_predicted_value_close,accuracy_close= evaluate(final_date_list,closing_prices_list,len(closing_prices_list)+1,classifier)
	Stock_predicted_value_open,accuracy_open= evaluate(final_date_list,openning_prices_list,len(openning_prices_list)+1,classifier)
	Stock_predicted_value_high,accuracy_high = evaluate(final_date_list,High_prices_list,len(High_prices_list)+1,classifier)
	Stock_predicted_value_low,accuracy_low = evaluate(final_date_list,Low_prices_list,len(Low_prices_list)+1,classifier)

	objClose={"Accuracy":accuracy_close,"PredictedPrice":Stock_predicted_value_close,"Data":closing_prices_list}
	objOpen={"Accuracy":accuracy_open,"PredictedPrice":Stock_predicted_value_open,"Data":openning_prices_list}
	objHigh={"Accuracy":accuracy_high,"PredictedPrice":Stock_predicted_value_high,"Data":High_prices_list}
	objLow={"Accuracy":accuracy_low,"PredictedPrice":Stock_predicted_value_low,"Data":Low_prices_list}
	
	objResponse={"dates":date1,"values":{"Close":objClose,"Open":objOpen,"High":objHigh,"Low":objLow}}
	
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'success', 'response':json.dumps(objResponse)}))

except Exception as e:
	print("Content-type:application/json\r\n\r\n")
	print(json.dumps({'status':'error', 'except':json.dumps(e)}))