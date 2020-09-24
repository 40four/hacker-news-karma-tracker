const files = require('./writeDataFile');
const db = require('../../database/pool');
const { DateTime } = require("luxon");
const log = require('pino')({'level': 'debug'});

(async () => {
	//files.archiveDataFile();
	files.newArchive();

	const myArgs = process.argv.slice(2);
	log.debug({...myArgs}, 'myArgs' );

	const dateConfig = {
		'year': myArgs[0],
		'month': myArgs[1],
		'day': myArgs[2]
	};

	const now = DateTime.fromObject(dateConfig);

	const nowStart = now.startOf('day');
	const dateObj = nowStart.toObject();

	const midnightTomorrow =  now.plus({ days: 1 }).startOf('day').toSQL();

	const rows = await db.getOneDayDiffs(nowStart.toSQL(), midnightTomorrow);

	const sortedByDiff = [...rows].sort((a, b) => a.Diff - b.Diff);
	const losers = sortedByDiff.slice(0, 20);
	const gainers = sortedByDiff.slice(-20).sort((a, b) => b.Diff - a.Diff);

	const dataForFile = {
		'gainers': gainers,
		'losers': losers,
		'dateObj': dateObj
	};
	
	files.writeDataFile(dataForFile, true);
})()

