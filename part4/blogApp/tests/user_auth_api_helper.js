const User = require('../models/user')

const initialUsers = [
    {
        "username": "admin_master",
        "name": "System Admin",
        "password": "InitialPassword2026!"
    },
    {
        "username": "dev_runner",
        "name": "Alice Developer",
        "password": "dev-password-99"
    },
    {
        "username": "test_user_01",
        "name": "Bob Tester",
        "password": "simplepassword123"
    }
]

const usersInDb = async () => {
  const allUsers = await User.find({})
  return allUsers.map(user => user.toJSON())
}

module.exports = {
    initialUsers,
    usersInDb
}