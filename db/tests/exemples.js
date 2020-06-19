require("dotenv").config(); // read the .env file into process.env

const debug = require('debug')('test:mongo');

const dbOpts = require("../../config/db");
const { uri, options } = dbOpts.test;

const Store = require('../index')

Store.connect({ uri, options })
.then(async database => {
  const Users = database.collection('Users');
  const Comments = database.collection('Comments');

  /* Limit the search to 1 element and skip the first 1 element, 
   * Returns only the fields specified in the projection
   * Not possible to include and exclude fields in the same projection
   * Only Exception is _id field
   */
  const result1 = await Users.find({}, {
    limit:1,
    skip:1,
    projection: { hello:1, wtf:1, _id:0 }
  }).toArray()

  const result2_1 = await Users.insertMany([
    { userId: 'er45ik6G', name: 'Tom',   lastname: 'Cout', descr: 'Coffee and cakes' },
    { userId: 'er45ik6H', name: 'Luc',   lastname: 'Tommert', descr: 'Gourmet hamburgers' },
    { userId: 'er45ik6I', name: 'Topas', lastname: 'Proi', descr: 'Just coffee' },
    { userId: 'er45ik6J', name: 'Topmy', lastname: 'Loter', descr: 'Indonesian goods' }
  ])

  const result2_2 = await Comments.insertMany([
    { uid: 'er45ik6G', pid: 444, comment: 'blah' },
    { uid: 'er45ik6G', pid: 888, comment: 'asdf' },
    { uid: 'er45ik6I', pid: 444, comment: 'qwer' }
  ])

  /* Search for name matching Luc or Tom and limit result to 3 */
  const result3 = await Users.find({ 
    $or: [{ name: 'Tom' }, { name: 'Luc' }] 
  }, {
    limit: 3
  }).toArray()

  /* Search for a name that matches one of the elements in the array */
  const result4 = await Users.find({ $or: [{ name: { $in: [ 'Tom', 'Luc' ]} }] }).toArray()

  /* Search for a world in descr - only full match works with $search */
  await Users.createIndex( { descr: 'text' } )
  const result5 = await Users.find({ $text: { $search: "coffee" } }).toArray()

  /* Search for a partial match of tom in name and lastname */
  const search = new RegExp('tom', 'i')
  const result6 = await Users.find({ $or: [{ name: search }, { lastname: search }] }).toArray()

  /* Perform a lookup (equivalent of join) */
  const result7 = await Comments.aggregate([
    {
      $lookup: {
        from: 'Users',
        localField: 'uid',
        foreignField: 'userId',
        as: 'user'
      }
    }
  ]).toArray()

  await Users.drop()
  await Comments.drop()
  Store.disconnect()
  console.log('end')
})
.catch(err => {
  debug("Error connecting to db", err)
})

