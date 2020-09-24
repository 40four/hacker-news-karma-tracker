class MainPage {

	data() {
		return {
			gainers: GAINER_DATA,

			losers: LOSER_DATA,

			dateObj: DATE_OBJ,

			layout: 'tableView.njk',
		};
	}

}

module.exports = MainPage;
