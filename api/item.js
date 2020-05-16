function getOneItem(api, itemId) {
	//const genItemEndpoint = (id) => api.ref(`/v0/item/${id}`);
	const itemEndpoint = api.ref(`/v0/item/${itemId}`);

	itemEndpoint.once('value', (snapshot) => {
		const thisValue = snapshot.val();
		if (!thisValue.deleted) {
			console.log("THIS", thisValue);
		}
		
	});
}

module.exports = getOneItem;
