const log = require('pino')();
const firebase = require("firebase/app");
const database = require("firebase/database");
const CronJob = require('cron').CronJob;

const maxId = require("./lib/maxIdListener.js");
const measure = require("./lib/measureKarma.js");

const firebaseConfig = {
	databaseURL: "https://hacker-news.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, 'hackernews');
log.info(`Firebase initialized - ${app.name}`);
// Get HN database
const api = firebase.database(app);

const maxIdRef = maxId.listenForChanges(api);

//Fire every night at midnight 
const karmaCron = new CronJob({
	cronTime: '0 0 * * *',
	onTick: () => measure.allKarma(api),
	start: true,
	timeZone: 'America/New_York',
	runOnInit: false
});

//module.exports = {
	//'api': api,
	//'app': app,
	//'maxId': maxIdEndpoint,
	//'measure': measure
//}
