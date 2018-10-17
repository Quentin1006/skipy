const cluster = require('cluster');
const debug = require("debug")("basiccluster:index")

const spawn = (i, workers) => {
    workers[i] = cluster.fork();

    // Optional: Restart worker on exit
    workers[i].on('exit', (code, signal) => {
        console.log("worker died", code, signal);
        console.log('respawning worker', i);
        spawn(i);
    });
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
        isMaster : () => cluster.isMaster,
        isWorker : () => cluster.isWorker,
        worker : () => cluster.worker,
        startMaster: () => {
            const workers = [];
            for (let i = 0; i < numCpus; i++) {
                spawn(i, workers);
            }
        }
    }

};