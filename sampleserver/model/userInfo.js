
const f = function(){};

const userInfo = {
	login: {
		password: '',
		session: 'id',
		onLogoff: f,
		public:{
			sex: 'm',
			status: 'God mode'
		}
	}
};
const currentLogins = {
	'id': 'login'
};
const sex = {m:'male', f: 'female'};

module.exports  = {
	
	LOGIN_AND_PASSWORD_REQUIRED :'LOGIN_AND_PASSWORD_REQUIRED',
	PASSWORD_REQUIRED: 'PASSWORD_REQUIRED',
	USER_NOT_FOUND : 'USER_NOT_FOUND',
	LOGIN_FAILED : 'LOGIN_FAILED',
	USER_EXISTS : 'USER_EXISTS',

	SEX: sex,
	////
	getUserInfo: function(sessionId){
		if(!currentLogins[sessionId]) return null;
		return userInfo[currentLogins[sessionId]];
	},
	loginUser: function(sessionId, login, password, onLogoff){
		if(!login || !password || !login.trim() || !password.trim())
			return this.LOGIN_AND_PASSWORD_REQUIRED;
		login = login.trim(); password = password.trim();
		var info = userInfo[login];
		if(!info) return this.USER_NOT_FOUND;
		if(info.password !== password) return this.LOGIN_FAILED;

		this.logoffUser(info.session);
		info.session = sessionId;
		info.loginTime = new Date().getTime();
		info.onLogoff = onLogoff;
		currentLogins[sessionId] = login;

	},
	logoffUser: function (sessionId) {
		var login = currentLogins[sessionId];
		if(!login) return false;
		var info = userInfo[login];
		if(!info) return false;
		info.onLogoff();
		delete info.session;
		info.onLogoff = f;
		delete currentLogins[sessionId];
		return true;
	},
	createUser: function(login, password){
		if(!login || !password) return this.LOGIN_AND_PASSWORD_REQUIRED;
		login = login.trim(); 
		password = password.trim();
		if(!login || !password) return this.LOGIN_AND_PASSWORD_REQUIRED;
		if(userInfo[login]) return this.USER_EXISTS;
		userInfo[login] = {
			password: password,
			onLogoff: f
		};
	},
	setUserPublic: function(sessionId, public){
		var info = this.getUserInfo(sessionId);
		if(!info) return this.USER_NOT_FOUND;
		info.public = public;
	},
	changePassword: function(sessionId, password){
		if(!password || ! password.trim()) return this.PASSWORD_REQUIRED;
		var info = this.getUserInfo(sessionId);
		if(!info) return this.USER_NOT_FOUND;
		info.password = password.trim();
	},
	userExists: function(login){
		login = (login || '').trim();
		return !!userInfo[login];
	}

};