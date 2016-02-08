"use strict";

const MongoReporter = require('./reporters/mongoReporter.js')
const FileReporter = require('./reporters/fileReporter.js')

const fs = require('fs');
//TODO dependency
const request = require('request');

//TODO put in argv
const settingFilename = "settings.json"
const logFilename = "monitorLog.txt"
const mongoURL = "mongodb://page-monitor:test@apollo.modulusmongo.net:27017/Suh4ehyr"

const settings = JSON.parse(fs.readFileSync(settingFilename, 'utf8'));

let reporters = [new MongoReporter(mongoURL), new FileReporter(logFilename)]

//TODO it could be modulirized as a Sheduler that takes reporters as arguments
const checkStatus  = () => {

	//a separate module for a single task function would be probably overkill, so I have it here
	let timestamp = new Date()

	let promises = settings.checks.map( (aCheck) => {
		//TODO catch exceptions
		return new Promise( (fulfill, deny) => {
			let requestTime = new Date()
			request(aCheck.url, (error, response, body) => {
				let res = {url : aCheck.url, latency: new Date() - requestTime}

				if(error) {
					res.status = "CONNECTION_FAIL"
					res.error = error.message
				} else {
					// console.log(body)
					if(!aCheck.content || body.indexOf(aCheck.content) !== -1) {
						res.status = "OK"
					} else {
						res.status = "CONTENT_FAIL"
						res.error = "Page content did not match requirement: " + aCheck.content
					}
				}

				fulfill(res)
			});
		});
	 });


	Promise.all(promises).then ( (data) => {
		data = {timestamp: timestamp , checks: data}

		for (let reporter of reporters)  {
			reporter.onUpdate(data)
		}

	}).catch( (err) => {
		console.log("Unexpected error occured" + err)
	})

}

checkStatus()
setInterval( checkStatus, settings.checkIntervalSec*1000);
