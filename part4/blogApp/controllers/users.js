const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
    const {username, name, password}  = request.body
    if(!password || password.length < 3 ) {
        return response.status(400).json({error: 'password must be at least 3 characters long'})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User(
        {
            username,
            name,
            passwordHash,
        }
    )

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})


userRouter.get('/', async (request, response) => {
    const allUsers = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
    response.status(200).json(allUsers)
})




module.exports = userRouter