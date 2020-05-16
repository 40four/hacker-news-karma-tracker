const log = require('pino')({'level': 'debug'});
var CronJob = require('cron').CronJob;

const { 
	api,
	maxId,
	measure
} = require('./api/index.js');


try {
	maxId.listenForChanges(api);

	const job = new CronJob(
		'0 0 0 * * *',
		measure.measureAllKarma(api);,
		null,
		true,
		'America/Los_Angeles'
	);

} catch (err) {

	log.error({...err}, "Main app error");

} finally {
	//const shutdown = (app) => {
		//app.delete()
		  //.then(function() {
			//console.log("App deleted successfully");
		  //})
		  //.catch(function(error) {
			//console.log("Error deleting app:", error);
		  //});
	//};
}
