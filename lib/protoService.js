'use strict';
var logger = require('./logger.js');
/**
 * public interface for all services
 */
module.exports={
	onAdd: function(session, data, state){
		// logger.log('onAdd is not implemented');
	},
	onKill: function(session, state){
		// logger.log('onKill is not implemented');
	},
	onRem: function(session, data, state){
		return {};
	},
	actionHandlers: {}//Map of action handlers
};
