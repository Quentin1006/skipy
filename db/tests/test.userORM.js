require("dotenv").config(); // read the .env file into process.env
const db = require('../index')

describe("Testing DB conn and that methods are hooked to db", () => {

  beforeAll(() => {
    return db.start()
  })

  afterAll(() => {
    return db.stop()
  })

  test('DB should exist', () => {
    expect(db.isConnected).toBeDefined()
  })

  test('DB is up and running', () => {
    expect(db.isConnected()).toBeTruthy()
  })


  test('db has method getUsers', () => {
    expect(db.User.getUsers).toBeDefined()
  })
})