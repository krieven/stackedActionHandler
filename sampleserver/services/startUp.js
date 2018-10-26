
var proto = require('../../lib/protoService.js');
var logger = require('../../lib/logger.js');

function reset(session){
	var context = session.getContext();
	if(!context.userInfo){
		session.sendJSON({
			type: 'switch-panel',
			data:{
				type: 'welcome',
				data: [
					{title:'login', data:{type:'login'}},
					{title:'register', data:{type:'register'}}
				]
			}
		});
	} else {
		session.sendJSON({
			type: 'switch-panel',
			data:{
				type: 'theapp',
				data: {
					userInfo: context.userInfo
				}
			}
		});
		session.addService(
			require('./theApp.js'),
			{},
			function(res){
				reset(session);
			}
		);
	}
}

function Service(){
	var me = this;
	this.onAdd = function(session, data, state){
		reset(session);
	};

	var handlers = this.actionHandlers = this.actionHandlers || {};

	handlers.login = function(session, action, state){
		logger.log(action);
	};

	handlers.register = function(session, action, state){
		logger.log(action);
		
		session.addService(
			require('./register.js'),
			{},
			function(res){
				reset(session);
			}
		);
	};

	handlers.logoff = function(session, action, state){
		session.killServicesTill(me);
		session.getContext().userInfo = null;
		reset(session);
	};

}

Service.prototype=proto;

module.exports = new Service();
