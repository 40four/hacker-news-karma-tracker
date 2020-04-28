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
	'( Username )',
	`VALUES( ? )`
].join(' ');
//const params = [
	//'blaze'
//]

function insertUser(userName) {
	pool.execute(
		insertQuery,
		[ userName ],
		function(err, results) {
			console.log("Results", results);
			
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
	const [rows, fields] = await promisePool.execute(
		selectAllUsers
	);

	return rows;
}


module.exports = {
	insertUser,
	insertKarma,
	getAllUsers
}
