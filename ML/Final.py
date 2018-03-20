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


date1=[]
date2=[]
final_date_list=[]
closing_prices_list=[]
openning_prices_list=[]
High_prices_list=[]
Low_prices_list=[]


def google_stocks():
	quandl.ApiConfig.api_key = "M5HWLF9jXDTrXrcWnpEe"
	data = quandl.get_table('WIKI/PRICES', qopts = { 'columns': ['ticker', 'date', 'close','open','high','low','Volume'] }, ticker = ['AAPL'], date = { 'gte': '2017-06-01', 'lte': '2017-12-31' })
	for index in data['date']:
		date1.append(index)
	date2=map(str,date1)
	# print date2
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


def training_model(final_date_list,closing_prices):
	prdeicted_values=[]
	price_test=[]
	date_test=[]
	date_training=[]
	price_training=[]
	percentage_count= 0.8*len(closing_prices)
	percentage_count =int(round(percentage_count)) 
	i=0
	while(i<=percentage_count):
		date_training.append(final_date_list[i])
		price_training.append(closing_prices[i])
		i=i+1
	i=percentage_count
	while(i<=percentage_count+4):
		date_test.append(final_date_list[i])
		price_test.append(closing_prices[i])
		i=i+1
	date_training = np.reshape(date_training, (len(date_training),1)) 
	price_training = np.reshape(price_training, (len(price_training),1))
	linear_mod = linear_model.LinearRegression() 
	linear_mod.fit(date_training,price_training) 
	StockPriceFornextperiod = linear_mod.predict(len(final_date_list)+1)[0][0]
	prdeicted_values.append( linear_mod.predict(len(price_training)+1)[0][0])
	prdeicted_values.append( linear_mod.predict(len(price_training)+2)[0][0])  
	prdeicted_values.append( linear_mod.predict(len(price_training)+3)[0][0])  
	prdeicted_values.append( linear_mod.predict(len(price_training)+4)[0][0]) 
	prdeicted_values.append( linear_mod.predict(len(price_training)+5)[0][0]) 
	return prdeicted_values,price_test,StockPriceFornextperiod
	
def evaluate(true_value, predict_value):
	rms = sqrt(mean_squared_error(true_value,predict_value))
	diff=abs(true_value[0] - predict_value[0])
	value=diff/true_value[0]
	value=100-(value*100)
	print(value)
	#accuracy =accuracy_score(true_label,predict_label)
	return rms
	
def predict(dates,price):
	price_test=[]
	prdeicted_values1=[]
	prdeicted_values2=[]
	price_test1=[]
	price_test2=[]
	predicted_price1,price_test,stockprice =training_model(dates,price)
	# print(stockprice)
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
	accuracy = evaluate(price_test2,prdeicted_values2)
	# print(accuracy)

if __name__ == '__main__':
	google_stocks()
	predict(final_date_list,closing_prices_list)
	predict(final_date_list,openning_prices_list)
	predict(final_date_list,Low_prices_list)
	predict(final_date_list,High_prices_list)