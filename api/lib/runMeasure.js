const log = require('pino')();
const firebase = require("firebase/app");
const database = require("firebase/database");
const karma = require('./karma');

const firebaseConfig = {
	databaseURL: "https://hacker-news.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, 'hackernews');
log.info(`CLI - Firebase initialized - ${app.name}`);
// Get HN database
const api = firebase.database(app);

karma.measureAll(api);
