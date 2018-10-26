var proto = require('../../lib/protoService.js');
var logger = require('../../lib/logger.js');

function Service(){
	var handlers = this.actionHandlers = this.actionHandlers || {};
	this.onAdd = function(session, args, state){
		session.sendJSON(
			{
				type: 'switch-panel',
				data: {
					type: 'register:main',
					data: {
						type: 'first-step'
					}
				}
			}
		);
	};


}

Service.prototype = proto;

module.exports = new Service();