const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, after, beforeEach , describe} = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const helper = require('./user_auth_api_helper')
const User = require('../models/user')

beforeEach(

    async () => {
        await User.deleteMany({})
        for ( let user of helper.initialUsers) {
            const passwordHash = await bcrypt.hash(user.password, 10)
            const newUser = new User({username: user.username, name: user.name, passwordHash:passwordHash})
            await newUser.save()
        }
    }
)


describe('when there are initial users in db', () => {
  
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        "username": "admin_master",
        "name": "System Admin",
        "password": "InitialPassword2026!"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('when adding user fails', () => {
    test('username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithShortUsername = {                                                                                                         
            username: 'ab',                                                                                                                       
            name: 'Test User',                                                                                                                    
            password: 'validpassword'                                                                                                             
        }   

        const result = await api.post('/api/users')
        .send(userWithShortUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('shorter than the minimum allowed length'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithShortPassword = {                                                                                                         
            username: 'validuser',                                                                                                                
            name: 'Test User',                                                                                                                    
            password: 'ab'                                                                                                                        
        }      

        const result = await api.post('/api/users')
        .send(userWithShortPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password must be at least'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('no username provided', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutUsername = {                                                                                                           
            name: 'Test User',                                                                                                                    
            password: 'validpassword'                                                                                                             
        }     

        const result = await api.post('/api/users')
        .send(userWithoutUsername)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('is required'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('no password provided', async () => {
        const usersAtStart = await helper.usersInDb()

        const userWithoutPassword = {                                                                                                           
            username: 'validuser',                                                                                                                
            name: 'Test User'                                                                                                                     
        }        

        const result = await api.post('/api/users')
        .send(userWithoutPassword)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password must be at least'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})


after(async () => {
    await mongoose.connection.close()
})