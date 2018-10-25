const fs = require('fs');
const readJSON = (path) => JSON.parse(fs.readFileSync(path, {encoding:'utf-8'}));
const writeJSON = (path, data) => fs.writeFileSync(path, JSON.stringify(data));


class Store {
    constructor(dbFile, ormList){
        this._data = readJSON(dbFile);
        this._dbFile = dbFile;

        this._mapOrmMethodsToDb(ormList);

        this.get = this.get.bind(this);
        this.set = this.set.bind(this);
        this._mapOrmMethodsToDb = this._mapOrmMethodsToDb.bind(this);
    }


    get(){
        return this._data;
    }


    set(newDb){
        writeJSON(this._dbFile, newDb)
        this._data = readJSON(this._dbFile);
    }


    _mapOrmMethodsToDb(arrayOfORM) {
        arrayOfORM.forEach(ormFct => {
            const orm = ormFct(this);

            Object.keys(orm).forEach(method => {
                Store.prototype[method] = (orm[method]).bind(this);
            })
        })
    }
    
}


module.exports = Store;