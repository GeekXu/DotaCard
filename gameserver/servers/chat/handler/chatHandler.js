var chatRemote = require('../remote/chatRemote');
var xianhoushou = new Array();

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

var handler = Handler.prototype;

/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
handler.send = function(msg, session, next) {
	//console.log('chat.handler.send called');
	var rid = session.get('rid');
	var uid = session.uid.split('*')[0];
	var channelService = this.app.get('channelService');
	var param = {
		route: 'onChat',
		//cardID:msg.cardID,
		//FightPos:msg.FightPos-5,
		msg:msg.content,
		from: uid,
		target: msg.target
	};
	channel = channelService.getChannel(rid, false);

	//the target is all users
	//if(msg.target == '*') {
		channel.pushMessage(param);
	//}
	//the target is specific user
	/*
	else {
		var tuid = msg.target + '*' + rid;
		var tsid = channel.getMember(tuid)['sid'];
		channelService.pushMessageByUids(param, [{
			uid: tuid,
			sid: tsid
		}]);
	}
	*/
	//console.log('send call is from order:',msg.fromorder);
	if (msg.fromorder==2) {
		//console.log('push on BeginAttack');
		param={
			route: 'onBeginAttack',
		}
		channel.pushMessage(param);
	};

	next(null, {
		route: msg.route
	});
};