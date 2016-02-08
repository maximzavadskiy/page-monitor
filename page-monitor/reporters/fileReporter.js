"use strict";

const fs = require('fs');

class FileReporter {
	constructor(filename) {
		this.filename = filename
	}

	onUpdate(data) {
		//since opening/closing files is cheap, we don't need to keep it open between updates
		let str = "################# " + data.timestamp + "############### \n" +
		    "URL" + " ".repeat(47) + "STATUS" + " ".repeat(44) + "LATENCY(ms)" + "  "+ "ERROR_DESC\n" +
		    "----------------------------------------------------------------------------------------------------------------------- \n"

		str += data.checks.map( (data) => {
			return data.url + " ".repeat(50 - data.url.length) + 
			data.status + " ".repeat(50 - data.status.length) + 
			data.latency + " ".repeat(13 - data.latency.toString().length)
			+ data.error
		}).join("\n")
		
		str += "\n\n"

		fs.appendFile(this.filename, str)
	}
}

module.exports = FileReporter