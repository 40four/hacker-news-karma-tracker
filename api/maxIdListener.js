const db = require("../database/pool.js");

function listenForChanges(api) {
	// TODO: Get maxid fron DB for starting point
	//let maxId = (async function getMax() {
		//const max = await db.getMaxId();
		//return max;
	//})();
	//console.log("MAX", maxId);
	let maxId;
	const maxIdEndpoint = api.ref('/v0/maxitem');
	const genItemEndpoint = (id) => api.ref(`/v0/item/${id}`);

	maxIdEndpoint.on('value', (snapshot) => {
		const newMaxId = snapshot.val();
		console.log('maxId', newMaxId);

		if (newMaxId) {
			const diff = newMaxId - maxId;
			// Wait for items to be ready, seems to be a small delay	
			setTimeout(() => {

				for ( let cnt = 0 ; cnt < diff; cnt ++ ) {
					const idAdjusted = newMaxId - cnt;
					const endP = genItemEndpoint(idAdjusted);
					console.log('adjust', idAdjusted);

					endP.once('value', (snapshot) => {
						const thisValue = snapshot.val();
						//console.log(thisValue);
						if ( thisValue ) {
							//console.log("Cur item", thisValue.id);
							if ( 'by' in thisValue ) {
								(async function findUser() {
									const result = await db.getUserByName(thisValue.by);
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
