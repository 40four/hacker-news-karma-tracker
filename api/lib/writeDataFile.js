const fs = require('fs');
const log = require('pino')({'level': 'debug'});
const { DateTime } = require("luxon");

exports.writeDataFile = (data, killProcess) => {
	//const dataObj = {
		//"gainers": data.gainers,
		//"losers": data.losers
	//};

	
	const template = fs.readFileSync(
		"11ty_input/_includes/mainTemplate.11ty.js",
		'utf8'
	);


	const findGainerRE = /GAINER_DATA/;
	const gainerDataString = JSON.stringify(data.gainers);
	const gainersAdded = template.replace(findGainerRE, gainerDataString);

	const findLoserRE = /LOSER_DATA/;
	const loserDataString = JSON.stringify(data.losers);
	const losersAdded = gainersAdded.replace(findLoserRE, loserDataString);

	const findDateRE = /DATE_OBJ/;
	const dateObjString = JSON.stringify(data.dateObj);
	const allDataAdded = losersAdded.replace(findDateRE, dateObjString);


	fs.writeFileSync(
		"11ty_input/index.11ty.js",
		allDataAdded,
		(err) => {
			if (err) throw err;
		}
	);

	if (killProcess) {
		process.exit()	
	}
};

exports.archiveDataFile = () => {
	log.info('Archive started');
	const oldData = require("../../11ty_input/index.json");
	const year = oldData.dateObj.year;
	const month = oldData.dateObj.month;
	const day = oldData.dateObj.day;
	const dt = DateTime.fromObject(oldData.dateObj);
	const monthAbbrev = dt.toFormat('LLL').toLowerCase();
	//log.debug({
		//'year': year,
		//'month': month,
		//'day': day
	//}, `imported data`);
	const destDir = `11ty_input/${year}/${monthAbbrev}`;

	function copyJsonCb(err) {
		if (err) throw err;
		log.info(`11ty_input/index.json was copied to ${destDir}/${day}.json`);
	}

	if (fs.existsSync(destDir)) {
		fs.copyFileSync(
			"11ty_input/index.json",
			`${destDir}/${day}.json`,
			copyJsonCb
		);
	} else {
		fs.mkdirSync(destDir, { recursive: true });
		fs.copyFileSync(
			"11ty_input/index.json",
			`${destDir}/${day}.json`,
			copyJsonCb
		);
	}

	function copyNjkCb(err) {
		if (err) throw err;
		log.info(`11ty_input/index.njk was copied to ${destDir}/${day}.njk`);
	}
	fs.copyFileSync("11ty_input/index.njk", `${destDir}/${day}.njk`, copyNjkCb)
	log.info('Archive finished');
}

exports.newArchive = () => {
	log.info('Archive started');
	//const oldData = require("../../11ty_input/index.11ty.js");


	const oldFile = fs.readFileSync("11ty_input/index.11ty.js", 'utf8');

	const findDateRE = /(?<=dateObj: )(.+)(?=,)/;
	const dateString = oldFile.match(findDateRE)[0];
	const dateObj = JSON.parse(dateString);

	log.debug(dateObj, "DATE OBJ");

	const year = dateObj.year;
	const month = dateObj.month;
	const day = dateObj.day;
	const dt = DateTime.fromObject(dateObj);
	const monthAbbrev = dt.toFormat('LLL').toLowerCase();
	//log.debug({
		//'year': year,
		//'month': month,
		//'day': day
	//}, `imported data`);
	const destDir = `11ty_input/${year}/${monthAbbrev}`;


	const copyJsonCb = (err) => {
		if (err) throw err;
		log.info(`11ty_input/index.json was copied to ${destDir}/${day}.json`);
	};

	if (fs.existsSync(destDir)) {
		fs.copyFileSync(
			"11ty_input/index.11ty.js",
			`${destDir}/${day}.11ty.js`,
			copyJsonCb
		);
	} else {
		fs.mkdirSync(destDir, { recursive: true });
		fs.copyFileSync(
			"11ty_input/index.11ty.js",
			`${destDir}/${day}.11ty.js`,
			copyJsonCb
		);
	}
}
