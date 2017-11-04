let analytics = {};

analytics.readable = function(a){
	return {
		referrer: a.r,
		medium: a.m,
		source: a.s,
		extra: a.e
	};
};

analytics.crunch = function(campaign_analytics){
	let counted_users = [];
	let ret = {
		users: 0,
		referrers: {},
		sources: {},
		mediums: {},
		dates:{}
	};

	for(let a of campaign_analytics){
		for(let k in a){
			if(a[k] === '' || a[k] === undefined){
				a[k] = '(N/A)';
			}
		}

		if(a.u && counted_users.indexOf(a.u) === -1){
			ret.users++;
		}
		
		if(!ret.referrers[a.r]){
			ret.referrers[a.r] = 0;
		}
		ret.referrers[a.r]++;

		if(!ret.sources[a.s]){
			ret.sources[a.s]=0;
		}
		ret.sources[a.s]++;

		if(!ret.mediums[a.m]){
			ret.mediums[a.m]=0;
		}
		ret.mediums[a.m]++;

		if(!ret.dates[a.d]){
			ret.dates[a.d]=0;
		}
		ret.dates[a.d]++;
	}
	return ret;
};

analytics.batch = function(campaigns){
	let ret = [];
	for(let c of campaigns){
		ret.push({
			id: c.id,
			name: c.name,
			analytics: analytics.crunch(c.analytics)
		});
	}
	return ret;
};

module.exports = analytics;