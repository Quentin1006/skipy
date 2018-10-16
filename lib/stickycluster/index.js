const http = require('http');
const net = require('net');
const cluster = require('cluster');
const farmhash = require('farmhash');
const debug = require("debug")("stickycluster:index")

const spawn = (i, workers) => {
    workers[i] = cluster.fork();

    // Optional: Restart worker on exit
    workers[i].on('exit', (code, signal) => {
        console.log('respawning worker', i);
        spawn(i);
    });
};

const worker_index = (ip, len) => {
    // Farmhash is the fastest and works with IPv6, too
    return farmhash.fingerprint32(ip) % len; 
};

module.exports = function(numCpus){
    if(numCpus && typeof numCpus !== 'number'){
        return new Error('The number of cpus has to be a number');
    }

    if(!numCpus){
        debug('no cpu number given');
        numCpus = require('os').cpus().length;
    }

    return {
        isMaster : () => {
            return cluster.isMaster;
        },
        isWorker : () => {
            return cluster.isWorker;
        },
        startMaster: (port) => {
            const workers = [];
            for (const i = 0; i < numCpus; i++) {
                spawn(i, workers);
            }

            return net.createServer({ pauseOnConnect: true }, function(conn) {
                // We received a connection and need to pass it to the appropriate
                // worker. Get the worker for this connection's source IP and pass
                // it the connection.
                const worker = workers[worker_index(conn.remoteAddress, numCpus)];
                // si isMaster = true, envoie un message au worker en question
                worker.send('sticky-session:connection', connection);
            }).listen(port);

        },
        startWorkers: (listenerFunc) => {
            const server;
            // sera le process du worker crée
            process.on('message', (message, conn) => {
                if (message !== 'sticky-session:connection') {
                    return;
                }

                // Emulate a connection event on the server by emitting the
                // event with the connection the master sent us.
                server.emit('connection', conn);

                conn.resume();
            });

            listenerFunc.worker = cluster.worker;
            server = http.createServer(listenerFunc);
            server.listen(0, 'localhost');

            return server;
        }
    }



};