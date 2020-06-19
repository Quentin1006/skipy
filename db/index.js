const Store = require('./store');
const ORMs = {
	User: require('./userORM')
}
	// require('./discussionORM'),
	// require('./friendshipORM'),
	// require('./notificationORM'),

const { dbOpts } = require("../config");
const { uri, options } = dbOpts.development;


let db = null;
let _isConnectedToDB = false;
/** The methods associated with the db are gonna filled the models with mapMethodsToModels*/
const models = Object.keys(ORMs).reduce((acc, key) => ({ ...acc, [key]: {}}), {})


/** For this app only one DB will be connected for nox 
 * Even if its possible to start several from Store object
 */
const start = () => {
	return Store.connect({ uri, options })
		.then(database => {
			db = database;
			mapMethodsToModels(db);
			_isConnectedToDB = true;
			return database
		})
		.catch(err => {
			debug('error connecting to db', err)
			process.exit(1)
		})
}

const stop = () => {
	_isConnectedToDB = false
	return Store.disconnect()
}


const get = () => {
	return db
}

const isConnected = () => {
	return Store.isConnected() && _isConnectedToDB
}


const mapMethodsToModels = (db) => {
	Object.keys(ORMs).forEach(keyORM => {
		const orm = ORMs[keyORM](db);
		Object.keys(orm).forEach(method => {
			models[keyORM][method] = orm[method]
		})
	})
}


module.exports = {
	isConnected,
	get,
	start,
	stop,
	...models
}