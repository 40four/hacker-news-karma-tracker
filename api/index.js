const log = require('pino')();
const firebase = require("firebase/app");
const database = require("firebase/database");

const maxIdEndpoint = require("./maxIdListener.js");

const firebaseConfig = {
	databaseURL: "https://hacker-news.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, 'hackernews');
log.info(`Firebase initialized - ${app.name}`);

const api = firebase.database(app);

//maxId.listenForChanges(api);

module.exports = {
	'api': api,
	'maxId': maxIdEndpoint
}
