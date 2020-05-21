const log = require('pino')({'level': 'debug'});
const db = require("../../database/pool.js");

exports.backfill = async () => {
	const currentMax = await db.getMaxItemId();
	
	return currentMax;
}
