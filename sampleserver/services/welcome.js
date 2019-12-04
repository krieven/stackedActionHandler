
var proto = require('../../lib/protoService.js');
var logger = require('../../lib/logger.js');

function reset(session){
	var context = session.getContext();
	var sessionId = session.getId();
	var userInfo = context.userInfo.getUserInfo(sessionId);
	if(!userInfo){
		session.sendJSON({
			type: 'welcome',
			data: [
				{title:'login', data:{type:'login'}},
				{title:'register', data:{type:'register'}}
			]
		});
	} else {
		session.sendJSON({
			type: 'theapp',
			data: {
				userInfo: userInfo
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
		session.sendJSON({
			type: 'welcome',
			data: {
				text:'Hello, this is a simple example of stacked action handler'
			}
		});
	};

	var handlers = this.actionHandlers = this.actionHandlers || {};

	handlers.login = function(session, action, state){
		logger.log(action);
	};

	handlers.register = function(session, action, state){
		session.addService(
			require('./register/register.js'),
			{},
			function(session, res){
				me.onAdd(session, {}, state);
			}
		);
	};

}

Service.prototype=proto;

module.exports = new Service();
