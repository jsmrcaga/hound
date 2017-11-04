const join = require('path').join;

class Pixel{
	constructor(id, campaign){
		this.id = id;
		this.campaign = campaign;
		this.analytics = [];
	}

	track(u){
		this.analytics.push({
			d: Date.now(),
			u: u
		})
		DB.save();
	}

	make(req, res){
		res.sendFile('./pixel.gif', {
			root: join(__dirname + '../../../files')
		});
	}
}

module.exports = Pixel;