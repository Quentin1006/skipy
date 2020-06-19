const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('db:index')

const dbs = {}
let mongoClient = null


/**
 * @role Connect to a single db
 * 
 * @param {String} name name of the db, important because
 * it will be the key in @const dbs 
 * @param {String} uri uri we connect to
 * @param {Object} options options of the db we connect to 
 * 
 * @returns a promise containing the db or the error
 */

const singleDbConnect = (name, uri, options={}) => {
	options = {
		...options,
		useNewUrlParser: true
	}

	return new Promise((resolve, reject) => {
		MongoClient.connect(uri, options, (err, client) => {
			if(err) {
				debug(err);
				return reject(err);
			}
			mongoClient = client;
			const database = client.db();
			dbs[name] = database;
			resolve(database);
		});
	})
}


/**
 * @role Make it possible to connect to multiple dbs at once
 *
 * @param {Object} dbs
 * Can accept an object of dbs or a directly a single db
 * First Case: 
 * A collection of db object whose key represents their name
 * each db must fit the structure of the Second Case
 * 
 * Second Case: 
 * A db object that must contains a @param {String} uri 
 * and optionnally a @param {Object} options
 * 
 * @returns a Promise with an array of the dbs we connected to
 */

const connect = (dbs) => {
	debug(dbs)
	if(dbs.uri) {
		return singleDbConnect('default', dbs.uri, dbs.options)
	}

	return Promise.all( Object.entries(dbs).map(([ name, db ]) => {
		return singleDbConnect(name, db.uri, db.options) 
	}))
}

const disconnect = () => {
    return mongoClient && mongoClient.close();
}

const isConnected = () => {
	return mongoClient && mongoClient.isConnected();
}


const get = (name='default') => {
	const db = dbs[name]
	return db 
		? db
		: { err: 'No db connected by that name' }
}


module.exports = {
	connect,
	disconnect,
	isConnected,
	get
};