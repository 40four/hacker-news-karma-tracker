const log = require('pino')({'level': 'debug'});
const db = require("../database/pool.js");
//const { api } = require('./index.js');

function measureAllKarma(api) {
	const genUserEndpoint = (username) => api.ref(`/v0/user/${username}`);

	(async function getAllUserKarma() {

		const allUsers = await db.getAllUsers();
		//console.log('USERS', allUsers);
		for (const user of allUsers) {

			genUserEndpoint(user.Username).once('value').then((snap) => {
				//console.log('Snap', snap.val());
				const thisSnap = snap.val();
				db.insertKarma(user.UserID, thisSnap.karma);
			});
		}

	})();
}

module.exports = {
	measureAllKarma
};
