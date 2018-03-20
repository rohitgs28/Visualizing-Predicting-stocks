import sys
import cgi, cgitb
import json
import sys, os
cgitb.enable()
form = cgi.FieldStorage()
name =eval(form.getvalue('name'))
fname =eval(form.getvalue('fname'))
try:    
	response = "Hello "+str(name) +" "+str(fname)
	print ("Content-type:application/json\r\n\r\n")
	print (json.dumps({'status':'yes', 'response':json.dumps(response)}))
except Exception as e:
	print ("Content-type:application/json\r\n\r\n")
	print (json.dumps({'status':'error', 'except':json.dumps(str(e))}))