class MainPage {

	data() {
		return {
			gainers: [],

			losers: [],

			dateObj: {"year":2020,"month":6,"day":4,"hour":0,"minute":0,"second":0,"millisecond":0},

			layout: 'tableView.njk',
		};
	}

}

module.exports = MainPage;
