const app = require('../app');
const debug = require('debug')('server:server');
const io = require("../socketio");
const https = require("https"); 
const { httpsOpts } = require("../config");
const numCPUs = process.env.CPUS;
const stickycluster = require("../lib/cluster/stickycluster")(numCPUs);

let server;

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3001');
app.set('port', port);


if(stickycluster.isMaster()){
	stickycluster.startMaster(port);
}

/**
 * On démarre les workers
 */
else {

	app.worker = stickycluster.getWorker();


	server = https.createServer(httpsOpts, app);
	stickycluster.startWorkers(server);
	io(server);

	server.on('error', onError);
	server.on('listening', onListening);


	
}



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	const bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	const addr = server.address();
	const bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	
	const listeningText =  'Listening on ' + bind
	debug(listeningText);
}
