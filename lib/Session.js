'use strict';
var logger = require('./logger.js');

var sessions = {};

function Session(socket, id, sessionContext, onclose){

	var session = this;

	sessions[id] = session;

	var serviceStack = [];
	
	session.getId = function(){
		return id;
	};
	session.getContext = function(){
		return sessionContext;
	};

	session.close = function(message){
		delete sessions[id];
		try{
			while(serviceStack.length > 0){
				if(!session.killService(serviceStack[0].service))
					break;
			}
		} catch(e){}
		
		try{
			onclose(session);
		} catch(e){}
		try{
			socket.close(message);
		} catch(e){}
	};

	session.send = function(message){
		try{
			socket.send(message);
			return true;
		}	catch(e){
			return false;
		}
	};
	session.sendJSON = function(obj){
		try{
			var message = JSON.stringify(obj);
			session.send(message);
		} catch (e) {
			logger.log(obj + ' cannot be serialized');
		}
	};

	function service(message){
		var action;
		var time = new Date().getTime();
		try{
			action = JSON.parse(message);
			action.ev = {timestamp: time};
		} catch(e){
			return;
		}
		for(var i=0; i < serviceStack.length; i++){
			var s = serviceStack[i];
			if(!s || !s.service || 
				!s.service.actionHandlers || 
				!s.service.actionHandlers[action.type]
			){
				continue;
			}
			try{
				s.service.actionHandlers[action.type](
					session, action, s.state
				)
				return;
			} catch(e){
				continue;
			}
		}
	}

	session.addService = function(service, args, onRemove){
		var state = {};
		serviceStack.unshift({service: service, onRemove: onRemove, state: state});
		if(service.onAdd){
			try{
				service.onAdd(session, args, state);
			} catch (e) {
				session.killService(service, e);
				return false;
			}
		}
		return true;
	};
	session.remService = function(service, args){
		if(service && serviceStack[0] && serviceStack[0].service === service){
			var s = serviceStack.shift();
			var result;
			if(s.service.onRem) {
				result = s.service.onRem(session, args, s.state);
			}
			if(s.onRemove){
				s.onRemove(session, result);
			}
			return true;
		} else {
			logger.log('service cannot be removed');
			return false;
		}
	};
	session.killService = function(service){
		if(service && serviceStack[0] && serviceStack[0].service === service){
			var s = serviceStack.shift();
			if(s.service.onKill) s.service.onKill(session, s.state);
			return true;
		} else {
			logger.log('service cannot be killed');
			return false;
		}
	};
	session.killServicesTill = function(service){
		while(service && serviceStack[0] && 
				serviceStack[0].service !== service && serviceStack.length>0){
			session.killService(serviceStack[0].service);
		}
		if(serviceStack.length > 0) return false;
		return true;
	}

	socket.on('close', session.close); 
	socket.on('error', session.close);
	socket.on('message', service);
}

var proto = Session.prototype = {};


module.exports = Session;
