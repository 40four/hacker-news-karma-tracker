const fs = require('fs');

exports.writeDataFile = (data) => {
	//const dataObj = {
		//"gainers": data.gainers,
		//"losers": data.losers
	//};


	fs.writeFile(
		"templates/index.json",
		JSON.stringify(data),
		(err) => {
			if (err) throw err;
		}
	);
};
