const fs = require('fs');

let db = {};
db.Models = require('./models/models');
let objects = {
	Campaigns:[],
	Pixels:[]
};

db.load = function(){
	if(!fs.existsSync(__dirname + '/data')){
		console.log('Creating data folder...');
		fs.mkdirSync(__dirname + '/data');
	}

	if(!fs.existsSync(__dirname + '/data/data.json')){
		console.log('Creating data file...');
		fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(objects));
	}

	let data = require(__dirname + '/data/data.json');
	for(let c of data.Campaigns){
		let cc = new db.Models.Campaign(c.id, c.name, c.description, c.redir);
		cc.analytics = c.analytics;
		objects.Campaigns.push(cc);
	}

	for(let p of data.Pixels){
		let pp = new db.Models.Pixel(p.id, p.campaign);
		objects.Pixels.push(pp);
	}
	console.log('DB loaded!');
};

db.save = function(){
	if(db.save.__locked){
		db.save.__queued = true;
		return;
	}

	db.save.__locked = true;
	fs.writeFile(__dirname + '/data/data.json', JSON.stringify(objects), function(){
		console.log('Saved DB!');

		db.save.__locked = false;
		if(db.save.__queued){
			db.save.__queued = false;
			return db.save();
		}
	});
};

db.Campaigns = {};
db.Campaigns.add = function(campaign){
	let exists = objects.Campaigns.find(c=>{return c.id === campaign.id});
	if(exists){
		throw new Error('Campaign already exists');
	}
	objects.Campaigns.push(campaign);
	db.save();
};

db.Campaigns.get = function(id){
	return objects.Campaigns.find(e=>{
		return e.id === id || e.name === id;
	});
};

db.Campaigns.all = function(){
	return objects.Campaigns;
};

db.Pixels = {};
db.Pixels.add = function(pixel){
	let exists = objects.Pixels.find(c=>{return c.id === pixel.id});
	if(exists){
		console.log(exists);
		throw new Error('Pixel already exists');
	}
	objects.Pixels.push(pixel);
	db.save();
};

db.Pixels.get = function(id){
	return objects.Pixels.find(e=>{
		return e.id === id || e.name === id;
	});
};

db.Pixels.all = function(){
	return objects.Pixels;
};

module.exports = db;