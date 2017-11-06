let utils = {};

utils.genUUID = function(){
	function gen4(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return gen4() + gen4() + '-' + gen4() + '-' + gen4() + '-' + gen4() + '-' + gen4() + gen4() + gen4();
};

utils.ignore = function(req){
	// user agent
	let ua = /(bitlybot)/gi;
	if(ua.test(req.get('user-agent'))){
		return true;
	}
	return false;
};

module.exports = utils;