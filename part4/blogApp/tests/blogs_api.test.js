const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./blogs_api_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

let token = null

beforeEach(

    async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('testpassword', 10)                                                                            
        const user = new User({ username: 'testuser', name: 'Test User', passwordHash })                                                      
        await user.save()

        const loginResponse = await api
        .post('/api/login')
        .send({username: 'testuser', password: 'testpassword'})

        token = `Bearer ${loginResponse.body.token}`

        for ( let blog of helper.initialBlogs) {
            const newBlog = new Blog({...blog, user: user._id})
            await newBlog.save()
        }
    }
)



test('test application returns the correct amount of blog posts in the JSON format', async () => {
     const response = await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/)
     assert.strictEqual(response.body.length, 4)
})

test('test unique identifier property of the blog posts is named id', async () => {
    const allBlogs = (await api.get('/api/blogs')).body;
    allBlogs.forEach(
        (blog) => {
            assert.ok(blog.id !== undefined)
            assert.strictEqual(blog._id, undefined)
        }
    )
})

test('test post works', async () => {
    const newBlog = {
        title: "The Office",
        author: "Michael Scott",
        url: "Office.com",
        likes: 1000,
    }
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token }).expect(201).expect('Content-Type', /application\/json/)
    const dbBlogAfter = await helper.blogsInDb()
    assert.strictEqual(dbBlogAfter.length, helper.initialBlogs.length+1)
    const blogsContent = dbBlogAfter.map((blog) => {
        return blog.author
    })
    assert(blogsContent.includes('Michael Scott'))
})


test('test that missing likes will default to 0', async () => {
    const newBlog = {
        title: "The Office",
        author: "Michael Scott",
        url: "Office.com",
    }
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token }).expect(201).expect('Content-Type', /application\/json/)
    const dbBlogAfter = await helper.blogsInDb()
    assert.strictEqual((dbBlogAfter.find((blog) => blog.title==="The Office")).likes, 0 )
})


test('test that missing title/url gives 400', async () => {
    const newBlog = {
        author: "Michael Scott"        
    }
    await api.post('/api/blogs').send(newBlog).set({ Authorization: token }).expect(400)
})


test('test deletion of a certain blog with id', async () => {
    const allBlogs = await helper.blogsInDb()
    const toBeDeleted = allBlogs[0]
    await api.delete(`/api/blogs/${toBeDeleted.id}`).set({ Authorization: token }).expect(204)
    const allBlogsEnd = await helper.blogsInDb()
    const ids = allBlogsEnd.map(b => b.id)
    assert(!ids.includes(toBeDeleted.id))
    assert.strictEqual(allBlogs.length-1, allBlogsEnd.length)

})

test('test put method', async () => {
    const allBlogs = await helper.blogsInDb()
    const toBeUpdated = allBlogs[0]
    const newBlog = {
        title: "The Office",
        author: "Michael Scott",
        likes: 31415,
        url: "Office.com",
    }
    await api.put(`/api/blogs/${toBeUpdated.id}`).send(newBlog).expect(200)
    const allBlogsEnd = await helper.blogsInDb()
    const theUpdated = allBlogsEnd.find(blog => blog.id ===toBeUpdated.id)
    assert.strictEqual(theUpdated.title, newBlog.title)
    assert.strictEqual(theUpdated.author, newBlog.author)
    assert.strictEqual(theUpdated.url, newBlog.url)
})

test('creation fails with 401 if token is not provided', async () => {
    const newBlog = {
        title: "Test Blog",                                                                                                                 
        author: "Test Author",                                                                                                              
        url: "http://test.com",                                                                                                             
        likes: 5 
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})