const fs = require('fs');
const log = require('pino')({'level': 'debug'});

exports.writeDataFile = (data, killProcess) => {
	//const dataObj = {
		//"gainers": data.gainers,
		//"losers": data.losers
	//};

	fs.writeFileSync(
		"templates/index.json",
		JSON.stringify(data),
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
	const oldData = require("../../templates/index.json");
	const year = oldData.dateObj.year;
	const month = oldData.dateObj.month;
	const day = oldData.dateObj.day;
	//log.debug({
		//'year': year,
		//'month': month,
		//'day': day
	//}, `imported data`);
	const destDir = `templates/${year}/${month}`;

	function copyJsonCb(err) {
		if (err) throw err;
		log.info(`templates/index.json was copied to ${destDir}/${day}.json`);
	}

	if (fs.existsSync(destDir)) {
		fs.copyFileSync(
			"templates/index.json",
			`${destDir}/${day}.json`,
			copyJsonCb
		);
	} else {
		fs.mkdirSync(destDir, { recursive: true });
		fs.copyFileSync(
			"templates/index.json",
			`${destDir}/${day}.json`,
			copyJsonCb
		);
	}

	function copyNjkCb(err) {
		if (err) throw err;
		log.info(`templates/index.njk was copied to ${destDir}/${day}.njk`);
	}
	fs.copyFileSync("templates/index.njk", `${destDir}/${day}.njk`, copyNjkCb)
	log.info('Archive finished');
}
