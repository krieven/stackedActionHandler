
var proto= require('../../lib/protoHandler.js');

function Service(){
	this.onAdd = function(session, data, state){
		session.sendJSON({
			type: 'welcome',
			data: [
				{title:'login', data:{type:'login'}},
				{title:'register', data:{type:'register'}}
			]
		});
	};
	this.onRem = function(session, data, state){
		
	};
	this.onKill = function(session, state){
		
	};

}

Service.prototype=proto;

module.exports = new Service();
