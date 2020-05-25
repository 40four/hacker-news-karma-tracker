const log = require('pino')({'level': 'debug'});
const db = require("../../database/pool.js");
//const backfill = require('./backfill.js');

exports.initListener = async (api) => {

	const maxCheck = await db.getMaxItemId();
	log.debug({...maxCheck}, 'Max check');

	if (maxCheck.length) {
		const resObj = maxCheck[0];
		var oldMaxId = resObj.max;
	} else {
		var oldMaxId;
	}

	const maxIdEndpoint = api.ref('/v0/maxitem');
	//const genItemEndpoint = (id) => api.ref(`/v0/item/${id}`);

	//Listen for changes to max id endpoint
	maxIdEndpoint.on('value', (snapshot) => {
		const newMaxId = snapshot.val();
		log.info({'newMaxId': newMaxId}, 'Max ID changed');

		if (newMaxId) {
			//Determine the difference between the new ID and the last one
			//recorded, used below to iterate new group of items
			const diff = newMaxId - oldMaxId;
			// Wait for items to be ready, seems to be a small delay	
			setTimeout(() => {
				const itemGen = iterateItems(newMaxId, diff, api);
				let iter = itemGen.next();
				
				while(!iter.done) {
					//log.debug('iterator');
					iter = itemGen.next();
				}
			}, (20000))

			// Update oldMaxId placeholder
			oldMaxId = newMaxId;
		}
	});

	return maxIdEndpoint;
}

/**
 * Generator funtion 
 */
function* iterateItems(newMaxId, diff, api) {
	let cnt = 0;

	while(cnt < diff) {
		const genItemEndpoint = (id) => api.ref(`/v0/item/${id}`);
		const idAdjusted = newMaxId - cnt;
		const endP = genItemEndpoint(idAdjusted);

		endP.once('value', (snapshot) => {
			const thisValue = snapshot.val();
			//log.info(thisValue);
			if ( thisValue ) {
				//log.info(thisValue.id, "Cur item");
				if ( 'by' in thisValue ) {
					(async function findUser() {
						const result = await db.getUserByName(thisValue.by)
							.catch((err) =>
								log.error({...err}, 'getUserByName() failed')
							);
						if ( result.hasOwnProperty(0) ) {
							db.updateUser(result[0].UserID, thisValue.id);
						} else {
							db.insertUser(thisValue.by, thisValue.id);
						}
					})();
				}
			}
		});

		cnt++;
	}
}
