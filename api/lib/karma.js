const log = require('pino')({'level': 'debug'});
const db = require("../../database/pool.js");
const { DateTime } = require("luxon");

exports.measureAll = (api) => {
	const genUserEndpoint = (username) => api.ref(`/v0/user/${username}`);

	(async function getAllUserKarma() {
		const allUsers = await db.getAllUsers();
		for (const user of allUsers) {
			genUserEndpoint(user.Username).once('value').then((snap) => {
				//console.log('Snap', snap.val());
				const thisSnap = snap.val();
				db.insertKarma(user.UserID, thisSnap.karma);
			});
		}
	})();

}

exports.compare = (startDay) => {
	//const now = new Date();
	const now = DateTime.fromISO(startDay.toISO());

	const midnightToday = now.startOf('day').toISO();

	const midnightYesterday = now.minus({ days: 1 }).startOf('day').toISO();

	const midnightTomorrow =  now.plus({ days: 1 }).startOf('day').toISO();
	
	//log.debug({
		//'now': now,
		//'today midnight': midnightToday,
		//'yesterday midnight': midnightYesterday,
		//'tomorrow midnight': midnightTomorrow
	//}, 'Date check');

	(async function getAllUserKarma() {
		const allUsers = await db.getAllUsers();

		const allDiffs = new Array();

		for (const curUser of allUsers) {
			const userId = curUser.UserID;
			const karmaOne = await db.compareKarma(
				userId,
				midnightYesterday,
				midnightToday
			);
			const karmaTwo = await db.compareKarma(
				userId,
				midnightToday,
				midnightTomorrow
			);

			if (karmaOne.length && karmaTwo.length) {
				const diff = karmaTwo[0].Karma - karmaOne[0].Karma;
				//log.debug({
					//'UserID': userId,
					//'diff': diff,
					//'karmaOne': karmaOne,
					//'karmaTwo': karmaTwo
				//}, 'Karma diff');

				const thisResult = {
					'UserID': userId,
					'diff': diff
				}
				
				allDiffs.push(thisResult)

				db.insertDiff(karmaOne[0].UserID, karmaOne[0].KarmaID, karmaTwo[0].KarmaID, diff);
			}
		}
	
		const sortedByDiff = [...allDiffs].sort((a, b) => a.diff - b.diff);
		const losers = sortedByDiff.slice(0, 20);
		const gainers = sortedByDiff.slice(-20).sort((a, b) => b.diff - a.diff);
		//const gainers = [...allDiffs].sort((a, b) => b.diff - a.diff);

		log.info({...gainers}, 'Top 20 Gainers');
		log.info({...losers}, 'Top 20 Losers');
	})();

}
