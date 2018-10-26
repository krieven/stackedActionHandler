moduleLoader(appContext, 'components/startUp.html', reader, 
	function(factory){
		var mainWindow = factory.create('main-window');
		mainWindow.mount(document.body);
		var socket = new WebSocket('ws://localhost:3030');
		appContext.socket = socket;
		appContext.panels.mainWindow = mainWindow;
		socket.onopen = function(){
			console.log('Connection established');
		};
		socket.onmessage = function(message){
			var action = JSON.parse(message.data);
			if(socketHandler[action.type]){
				socketHandler[action.type](action.data);
				return;
			}
			appContext.dispatcher.pub(action);
		};
		socket.onclose = function(event){
			if (event.wasClean) {
				console.log('Connection closed');
			} else {
				console.log('Connection interrupted');
			}
			console.log('Code: ' + event.code + ' reason: ' + event.reason);
		};
		socket.onerror = function(error){
			console.log('Connection error: ' + error);
		};
	}
);
