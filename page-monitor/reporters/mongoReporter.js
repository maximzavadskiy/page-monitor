"use strict";
const mongoClient = require('mongodb').MongoClient;

class MongoReporter {
	constructor(url) {
		this.connection = mongoClient.connect(url, {ssl:true})
	}

	onUpdate(data) {
		this.connection.then( (db) => { 
			//probably it will be a good idea to use timestamp as id for efficiency
			db.collection('checks')
			.insertOne(data)
			.catch( (e) => console.log("DB insert fail with error " + e))
		}).catch( (e) => console.log("DB access with  error" + e))
	}
	//TODO implement close connection method
}

module.exports = MongoReporter