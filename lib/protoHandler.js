'use strict';
/**
 * public interface for all services
 */
module.exports={
	onAdd: function(session, data, state){},
	onKill: function(session, state){},
	onRem: function(session, data, state){
		return {};
	},
	actionHandlers: {}
};
