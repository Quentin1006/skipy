const net = require('net');
const cluster = require('cluster');
const farmhash = require('farmhash');
const debug = require("debug")("stickycluster:index")

const spawn = (i, workers) => {
    workers[i] = cluster.fork();

    // Optional: Restart worker on exit
    workers[i].on('exit', (code, signal) => {
        console.log("worker died", code, signal);
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
        getWorker : () => cluster.worker,
        
        startMaster: (port) => {
            const workers = [];
            for (let i = 0; i < numCpus; i++) {
                spawn(i, workers);
            }

            return net.createServer({ pauseOnConnect: true }, function(conn) {
                // We received a connection and need to pass it to the appropriate
                // worker. Get the worker for this connection's source IP and pass
                // it the connection.
                // pauseOnConnect permet de ne pas commencer a lire la socket pour 
                // pouvoir transferer son contenu entier vers le worker
                const worker = workers[worker_index(conn.remoteAddress, numCpus)];
                // Une fois le worker choisi en fonction de l'ip 
                // le master transfert la connection qu'il doit recevoir
                worker.send('sticky-session:connection', conn);
            }).listen(port);

        },
        startWorkers: (server) => {

            // sera le process du worker créé
            process.on('message', (message, conn) => {
                if (message !== 'sticky-session:connection') {
                    return;
                }

                // Emulate a connection event on the server by emitting the
                // event with the connection the master sent us.
                server.emit('connection', conn);

                conn.resume();
            });

            //server.worker = cluster.worker;
            server.listen(0, process.env.DOMAIN);
        }
    }

};