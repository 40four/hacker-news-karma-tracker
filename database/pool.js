const log = require('pino')({'level': 'debug'});
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
//log.info('Config', config);

const pool = mysql.createPool(config);
const promisePool = pool.promise();
//log.info("pool", pool);

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
			if (err) {
				log.error({...err});
			} else {
				log.debug(
					{
						'insert id': results.insertId,
						'affected rows': results.affectedRows
					},
					"Insert User success"
				);
			}
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
			if (err) {
				log.error(err);
			} else {
				log.debug({
					'user id': userId,
					'response': results.info
				}, "Update User success");
			}
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
			log.debug({...results}, "Insert Karma results");
		}
	)
}

const selectAllUsers = 'SELECT UserID, Username FROM User';

async function getAllUsers() {
	const [ rows ] = await promisePool.execute(
		selectAllUsers
	).catch((err) => log.error({...err}, "SELECT all Users failed"));

	return rows;
}

const userQuery = 'SELECT * FROM User WHERE Username = ?';

async function getUserByName(name) {
	const [ rows ] = await promisePool.execute(
		userQuery,
		[ name ]
	).catch((err) => log.error({...err}, "Select User by name failed"));
	//log.info('Rows', rows);
	return rows;
}

const maxIdQuery = 'SELECT MAX(NewestItem) AS max FROM User';

async function getMaxItemId() {
	const [ rows ] = await promisePool.execute(
		maxIdQuery
	).catch((err) => log.error({...err}, "Get max item ID failed"));

	return rows;
}

const todayKarmaQuery = [
	'SELECT * FROM Karma',
	'WHERE UserID = ?',
	'AND CreatedAt BETWEEN ?',
	'AND ?'
].join(' ');

async function compareKarma(userId, dayOne, dayTwo) {
	const [ rows ] = await promisePool.execute(
		todayKarmaQuery,
		[ userId, dayOne, dayTwo ],

	).catch((err) => log.error({...err}, "Compare Karma failed"));

	return rows;
}

const insertDiffQuery = [
	'INSERT INTO Diff',
	'( UserID, FirstKarmaID, SecondKarmaID, Diff )',
	'VALUES ( ?, ?, ?, ? )'
].join(' ');

function insertDiff(userId, firstKarmaId, secondKarmaId, diff) {
	pool.execute(
		insertDiffQuery,
		[ userId, firstKarmaId, secondKarmaId, diff ],
		function(err, results) {
			if (err) {
				log.error({...err}, "Insert Diff Fail");
			} else {
				log.debug({
					'Insert ID': results.insertId,
					'affected rows': results.affectedRows
				}, "Insert Diff results");
			}
		}
	)
}


module.exports = {
	insertUser,
	updateUser,
	insertKarma,
	getAllUsers,
	getUserByName,
	getMaxItemId,
	compareKarma,
	insertDiff
}
