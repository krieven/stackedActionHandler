'use strict';
var Session = require('../lib/Session.js');
var ws = require('ws');
var express = require('express');
var logger = require('../lib/logger.js');
var startUp = require('./services/welcome.js');

var srv = express();
srv.use(express.static(__dirname+'/pub/'));
srv.use('/w3view/', express.static( __dirname+'/../node_modules/w3view/'));

var port = 3000;
srv.listen(port, function(){
	logger.log('listen '+port);
	logger.log(__dirname);
})

var server = new ws.Server({port:3030});

var appContext = {
	userInfo  : require('./model/userInfo.js')
};
function onclosesession(session){
	session.send('good by');
	// logger.log(session.getId()+' closed');

}

function newId(){
	return Math.random()+'-'+new Date().getTime();
}

server.on('connection',function(socket){
	var sess = new Session(
		socket, 
		newId(), 
		appContext, 
		onclosesession
	);
	sess.addService(startUp);
});