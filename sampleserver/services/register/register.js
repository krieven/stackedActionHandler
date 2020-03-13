var proto = require('../../../lib/protoService.js');
var logger = require('../../../lib/logger.js');

function Service(){
	var handlers = this.actionHandlers = {};

	this.onAdd = function(session, args, state){
		session.sendJSON(
			{
				type: 'register'
			}
		);
		session.addService(require('./first-step.js'));
	};

	handlers.exit = function(session, action, state){
		session.killServicesTill(this);
		session.remService(this);
	}.bind(this);


}

Service.prototype = proto;

module.exports = new Service();
