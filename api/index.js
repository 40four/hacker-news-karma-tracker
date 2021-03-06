const log = require('pino')();
const firebase = require("firebase/app");
const database = require("firebase/database");
const CronJob = require('cron').CronJob;
const { DateTime } = require("luxon");

const maxItemId = require("./lib/maxItemId.js");
const karma = require("./lib/karma.js");

const firebaseConfig = {
	databaseURL: "https://hacker-news.firebaseio.com/"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, 'hackernews');
log.info(`Firebase initialized - ${app.name}`);
// Get HN database
const api = firebase.database(app);

//const maxIdRef = maxItemId.initListener(api);

//Fire every night at midnight 
const karmaMeasureCron = new CronJob({
	cronTime: '0 0 * * *',
	onTick: () => karma.measureAll(api),
	start: true,
	timeZone: 'America/New_York',
	runOnInit: false
});

//Fire every night at 12:15 
const karmaCompareCron = new CronJob({
	cronTime: '15 0 * * *',
	onTick: () => karma.compare(),
	start: true,
	timeZone: 'America/New_York',
	runOnInit: false
});

//karma.measureAll(api);
//karma.compare()
