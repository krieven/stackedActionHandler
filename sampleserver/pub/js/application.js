var appContext = {
	dispatcher: newDispatcher(),
	panels: {}
};

var socketHandler={};
socketHandler['switch-panel']=function(data){
	appContext.panels.mainWindow.setData(data);
};