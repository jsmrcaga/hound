const join = require('path').join
const Webhooks = require(join(__dirname, '../../lib/webhooks'));
const qs = require('querystring');

class Campaign{
	constructor(id, name, description, redir){
		this.id = id;
		this.name = name;
		this.redir = redir;
		this.description = description;
		this.analytics = [];
	}

	track(referrer, source, medium, extra, user, pixel){
		let obj = {
			r: referrer,
			s: source,
			m: medium,
			e: extra,
			u:user,
			d: Date.now(),
			p: pixel || false
		};
		Webhooks.send(pixel ? 'tracking_pixel' : 'link_clicked', obj);
		this.analytics.push(obj);
		DB.save();
	}

	makeuri(referrer, source, medium, extra, fallback){
		let obj = {
			hound_ref: referrer,
			hound_source: source, 
			hound_medium: medium,
			hound_extra: extra instanceof Object ? JSON.stringify(extra) : extra
		};
		if(fallback){
			obj.redirect_uri = fallback;
		}
		return qs.stringify(obj);
	}
}

module.exports = Campaign;