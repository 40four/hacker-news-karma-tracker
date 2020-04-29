//require('dotenv').config();
require('dotenv').config({
	path: 'config/.env'
});

//const mysqlx = require('@mysql/xdevapi');
const mysql = require('mysql2');

const config = {
	host: process.env.DATABASE_HOST,
	port: process.env.DATABASE_PORT,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASS,
	database: 'HNFire',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
};
//console.log('Config', config);

const pool = mysql.createPool(config);
const promisePool = pool.promise();
//console.log("pool", pool);

const insertQuery = [
	'INSERT INTO User',
	'( Username, NewestItem )',
	`VALUES( ?, ? )`
].join(' ');
//const params = [
	//'blaze'
//]

function insertUser(userName, itemNum) {
	pool.execute(
		insertQuery,
		[ userName, itemNum ],
		function(err, results) {
			if (err) console.error(err);
			console.log("Insert User Res", results);
		}
	)
}

const updateUserQuery = [
	'UPDATE User',
	'SET NewestItem = ?',
	'WHERE UserID = ?'
].join(' ');

function updateUser(userId, itemId) {
	pool.execute(
		updateUserQuery,
		[ itemId, userId ],
		function(err, results) {
			if (err) console.error(err);
			console.log("Update User Res", userId, results);
		}
	)
}


const insertKarmaQuery = [
	'INSERT INTO Karma',
	'( UserID, Karma )',
	`VALUES( ?, ? )`
].join(' ');
//const params = [
	//'blaze'
//]
function insertKarma(userId, karma) {
	pool.execute(
		insertKarmaQuery,
		[ userId, karma ],
		function(err, results) {
			console.log("Insert Karma results", results);
		}
	)
}


const selectAllUsers = 'SELECT UserID, Username FROM User';

async function getAllUsers() {
	const [ rows ] = await promisePool.execute(
		selectAllUsers
	).catch((err) => console.error(err));

	return rows;
}

const userQuery = 'SELECT * FROM User WHERE Username = ?';

async function getUserByName(name) {
	const [ rows ] = await promisePool.execute(
		userQuery,
		[ name ]
	).catch((err) => console.error(err));
	//console.log('Rows', rows);
	return rows;
}

module.exports = {
	insertUser,
	updateUser,
	insertKarma,
	getAllUsers,
	getUserByName
}
