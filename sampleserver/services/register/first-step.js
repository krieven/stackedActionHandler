var proto = require('../../../lib/protoService.js');
var logger = require('../../../lib/logger.js');
var usersData = require('../../model/userInfo');

function Service(){
	var handlers = this.actionHandlers = this.actionHandlers || {};

	this.onAdd = function(session, data, state){
		session.sendJSON(
			{
				type:'first-step'
			}
		);
	};
	/**
	 * 
	 */
	handlers.name = function(session, action, state){
		logger.log(action);
		var userInfo = session.getContext().userInfo;
		if(userInfo.userExists(action.data.login)){
			session.sendJSON({
				type: 'sys-message',
				data: '"'+action.data.login+'" are already registered,'+
				' please enter another Login'
			});
			return;
		}
		var res = userInfo.createUser(action.data.login, action.data.password);
		session.sendJSON({
			type: 'second-step'
		});
	};

}



Service.prototype = proto;

module.exports = new Service();