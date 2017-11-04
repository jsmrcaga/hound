let utils = {};

utils.genUUID = function(){
	function gen4(){
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return gen4() + gen4() + '-' + gen4() + '-' + gen4() + '-' + gen4() + '-' + gen4() + gen4() + gen4();
};

module.exports = utils;