const fs = require('fs');
const log = require('pino')({'level': 'debug'});
const { DateTime } = require("luxon");

exports.writeDataFile = (data, killProcess) => {
	//const dataObj = {
		//"gainers": data.gainers,
		//"losers": data.losers
	//};

	fs.writeFileSync(
		"11ty_input/index.json",
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
