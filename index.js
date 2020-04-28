const firebase = require("firebase/app");
const database = require("firebase/database");
const data = require('./database/insertUser.js');


const firebaseConfig = {
	databaseURL: "https://hacker-news.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, 'hackernews');
console.log('App started', app.name);

const shutdown = (app) => {
	app.delete()
	  .then(function() {
		console.log("App deleted successfully");
	  })
	  .catch(function(error) {
		console.log("Error deleting app:", error);
	  });
};

//const database = app.database();
const db = firebase.database(app);

const maxIdEndpoint = db.ref('/v0/maxitem');

const itemEndpoint = db.ref('/v0/item');

//const itemEndpoint = db.ref('/v0/item').orderByChild('time').startAt(1587441600);

const genItemEndpoint = (itemID) => db.ref(`/v0/item/${itemID}`);

const genUserEndpoint = (username) => db.ref(`/v0/user/${username}`);

const targetTime = 1588017726;

//data.insertUser();


//maxIdEndpoint.on('value', (snapshot) => {
	//const newMaxId = snapshot.val();
	//console.log(snapshot.val());
	//if (newMaxId) {

	//}
//});

//const theDatum = genItemEndpoint(22996552).on('value', (snapshot) => {
	//console.log(snapshot.val());
//});
(async function getAllUserKarma() {

	const allUsers = await data.getAllUsers();
	//console.log('USERS', allUsers);
	for (const user of allUsers) {

		genUserEndpoint(user.Username).once('value').then((snap) => {
			console.log('Snap', snap.val());
			const thisSnap = snap.val();
			data.insertKarma(user.UserID, thisSnap.karma);
		});
	}

})();
//allUsers.forEach((item, index) => {
	//genUserEndpoint(item.Username).once('value').then((snap) => {
		//console.log('Snap', snap);
	//});

//});


const insertAllUsers = (userList) => {
	for (user of userList) {
		data.insertUser(user);
		
	}	
};

const walkItemsBackwards = (dataObj) => {
	console.log('Dataobj', dataObj);

	const thisID = (dataObj.maxID === dataObj.idCounter) ?
		dataObj.maxID :
		dataObj.idCounter;

	const theData = genItemEndpoint(thisID).once('value').then((snapshot) => {
		//console.log('Item', snapshot.val());
		const thisSnap = snapshot.val();
		if ( thisSnap ) {
			if ( thisSnap.by ) {
				dataObj.users.push(thisSnap.by);
			}
			if (thisSnap.time >= targetTime) {
				dataObj.idCounter--;
				walkItemsBackwards(dataObj);
			} else {
				console.log("Final coutdown", dataObj);
				insertAllUsers(dataObj.users);
				shutdown(app);
				return dataObj;
			}
		} else {
			dataObj.idCounter--;
			walkItemsBackwards(dataObj);
		}
	});
	return theData;
}

const allItemsSinceTimestamp = maxIdEndpoint.once('value')
	.then((snapshot) => {
		const dataObj = {
			users: []
		}
		dataObj.maxID = snapshot.val();
		dataObj.idCounter = snapshot.val();

		return dataObj;
	})
	.then((dataObj) => {
		//const finalData = walkItemsBackwards(dataObj);
		//console.log("Blazer", finalData);
		//const thisID = (dataObj.maxID === dataObj.idCounter) ?
			//dataObj.maxID :
			//dataObj.idCounter;

		//let curTime = 0;

		//const theData = genItemEndpoint(thisID).once('value').then((snapshot) => {
			////console.log('Item', snapshot.val());
			//const thisSnap = snapshot.val();
			//if ( thisSnap ) {
				//dataObj.users.push(thisSnap.by);
				
				//if (thisSnap.time >= targetTime) {
					//dataObj.idCounter--;
					//curTime = thisSnap.time;
				//} else {
					//console.log("Final coutdown", dataObj);
					//shutdown(app);
					//return dataObj;
				//}
			//} else {
				//dataObj.idCounter--;
			//}
		//});


		//while ()

	});



