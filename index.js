const { 
	api,
	maxId
} = require('./api/index.js');


maxId.listenForChanges(api);

//const shutdown = (app) => {
	//app.delete()
	  //.then(function() {
		//console.log("App deleted successfully");
	  //})
	  //.catch(function(error) {
		//console.log("Error deleting app:", error);
	  //});
//};

//const genUserEndpoint = (username) => db.ref(`/v0/user/${username}`);

//(async function getAllUserKarma() {

	//const allUsers = await data.getAllUsers();
	////console.log('USERS', allUsers);
	//for (const user of allUsers) {

		//genUserEndpoint(user.Username).once('value').then((snap) => {
			////console.log('Snap', snap.val());
			//const thisSnap = snap.val();
			//data.insertKarma(user.UserID, thisSnap.karma);
		//});
	//}

//})();
