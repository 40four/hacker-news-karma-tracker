const fs = require('fs');
const log = require('pino')({'level': 'debug'});

exports.writeDataFile = (data) => {
	//const dataObj = {
		//"gainers": data.gainers,
		//"losers": data.losers
	//};

	fs.writeFile(
		"templates/index.json",
		JSON.stringify(data),
		(err) => {
			if (err) throw err;
		}
	);
};

exports.archiveDataFile = () => {
	const oldData = require("../../templates/index.json");
	const year = oldData.dateObj.year;
	const month = oldData.dateObj.month;
	const day = oldData.dateObj.day;
	const destDir = `templates/${year}/${month}`;

	function copyJsonCb(err) {
		if (err) throw err;
		log.debug(`templates/index.json was copied to ${destDir}/${day}.json`);
	}

	if (fs.existsSync(destDir)) {
		fs.copyFile("templates/index.json", `${destDir}/${day}.json`, copyJsonCb);
	} else {
		fs.mkdirSync(destDir, { recursive: true });
		fs.copyFile("templates/index.json", `${destDir}/${day}.json`, copyJsonCb);
	}

	function copyNjkCb(err) {
		if (err) throw err;
		log.debug(`templates/index.njk was copied to ${destDir}/${day}.njk`);
	}
	fs.copyFile("templates/index.njk", `${destDir}/${day}.njk`, copyNjkCb)
}
