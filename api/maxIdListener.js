const log = require('pino')();
const db = require("../database/pool.js");

function listenForChanges(api) {
	// TODO: Get maxid fron DB for starting point
	//let maxId = (async function getMax() {
		//const max = await db.getMaxId();
		//return max;
	//})();
	//log.info(maxId,"MAX");
	let maxId;
	const maxIdEndpoint = api.ref('/v0/maxitem');
	const genItemEndpoint = (id) => api.ref(`/v0/item/${id}`);

	maxIdEndpoint.on('value', (snapshot) => {
		const newMaxId = snapshot.val();
		log.info({'newMaxId': newMaxId}, 'Max ID changed');

		if (newMaxId) {
			const diff = newMaxId - maxId;
			// Wait for items to be ready, seems to be a small delay	
			setTimeout(() => {

				for ( let cnt = 0 ; cnt < diff; cnt ++ ) {
					const idAdjusted = newMaxId - cnt;
					const endP = genItemEndpoint(idAdjusted);
					//log.info('adjust', idAdjusted);

					endP.once('value', (snapshot) => {
						const thisValue = snapshot.val();
						//log.info(thisValue);
						if ( thisValue ) {
							//log.info(thisValue.id, "Cur item");
							if ( 'by' in thisValue ) {
								(async function findUser() {
									const result = await db.getUserByName(thisValue.by);
									//console.log('USER search', result);
									
									// TODO: Note there is a possibility of a race
									// condition here if a user has consecutive or
									// near consecutive items
									if ( result.hasOwnProperty(0) ) {
										//console.log("RUZ", result);
										db.updateUser(result[0].UserID, thisValue.id);
									} else {
										//console.log("RAZ", result);
										db.insertUser(thisValue.by, thisValue.id);
									}
								})();
							}

						}
					});
				}

			}, (10000))


			//console.log('heyoh', newMaxId);
			maxId = newMaxId;
		}
		
	});
}

//function 

module.exports = {
	listenForChanges	
}
