require("dotenv").config(); // read the .env file into process.env
const debug = require('debug')('scripts:importdb');
const fs = require('fs')
const path = require('path')

const { isObject } = require('../utils')
const { dbOpts } = require('../config')
const { uri, options } = dbOpts.development

const DB = require('../db/index')

const data = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../db/data.json'), 
    { encoding: 'utf-8' }
  )
)

DB.start({ uri, options })
  .then(async database => {
    const collections = Object.keys(data)
    collections.forEach(async collection => {
      const Collection = database.collection(collection)
      const count = await Collection.countDocuments()
      if(count > 0) return 
      
      let dataCollection = data[collection]
      if (isObject(dataCollection)) {
        dataCollection = turnIntoArrayAndAddKeyAsId(dataCollection)
      }
      try {
        await Collection.insertMany(dataCollection)
      }
      catch(error) {
        debug("Probably wrong type passed", error)
      }
      DB.stop().then(() => process.exit(0))
    })
  })
  .catch(err => debug(err))


const turnIntoArrayAndAddKeyAsId = (object) => (
  Object.keys(object).map(item => {
    const itemObject = isObject(object[item]) ? object[item] : {name: object[item]}
    return {
      ...itemObject,
      id: item
    }
  })
)


