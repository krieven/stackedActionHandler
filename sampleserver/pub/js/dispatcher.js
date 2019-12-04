///////////////

function newDispatcher(){
	var subscribers = {};
	return {
		getTypes:function(){
			Object.getOwnPropertyNames(subscribers);
		},
		pub:function(type,data){
			subscribers[type]=subscribers[type] || [];
			for(var i=0;i<subscribers[type].length;i++){
				subscribers[type][i](data);
			}
		},
		sub:function(type,listener){
			subscribers[type]=subscribers[type] || [];
			if(typeof listener !=='function' || 
				subscribers[type].indexOf(listener)>=0)
						return;
			subscribers[type].push(listener);
			return listener;
		},
		unsub:function(type,listener){
			subscribers[type]=subscribers[type] || [];
			if(typeof listener ==='function' &&
				subscribers[type].indexOf(listener)>=0){
				subscribers[type].splice(subscribers[type].indexOf(listener),1);
			}
		}
	};
};

