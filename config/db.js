const { MONGODB_USERNAME, MONGODB_PWD, MONGODB_CLUSTER } = process.env;
// const uriDev = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PWD}@/test?retryWrites=true`;
const uriDev = `mongodb+srv://${MONGODB_USERNAME}:${encodeURIComponent(MONGODB_PWD)}@${MONGODB_CLUSTER}-nqvrf.mongodb.net/test?retryWrites=true&w=majority`
const dataImportHost = 'mongoSkipy-shard-0/mongoskipy-shard-00-00-nqvrf.mongodb.net:27017,mongoskipy-shard-00-01-nqvrf.mongodb.net:27017,mongoskipy-shard-00-02-nqvrf.mongodb.net:27017'
const optionsDev = {}

module.exports = {
  development : { 
    uri: uriDev, 
    options: optionsDev,
    dataImportHost
  },
  test : { 
    uri: uriDev, 
    options: optionsDev,
    dataImportHost
  }
}