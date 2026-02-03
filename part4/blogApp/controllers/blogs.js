const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'UserId missing or not valid' })
  }
  const blog = new Blog({
    title: body.title,                                                                                                          
    author: body.author,                                                                                                        
    url: body.url,                                                                                                              
    likes: body.likes,                                                                                                          
    user: user._id
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  const populatedBlog = await Blog.findById(result._id).populate('user', { username: 1, name: 1 })  
  response.status(201).json(populatedBlog) 
})

blogsRouter.delete('/:id', middleware.userExtractor , async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if(blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'unauthorized: only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newBlog = request.body

  const theBlog = await Blog.findById(request.params.id)
  if (!theBlog) return response.status(404).end()
  theBlog.user = newBlog.user
  theBlog.title = newBlog.title
  theBlog.author = newBlog.author
  theBlog.url = newBlog.url
  theBlog.likes = newBlog.likes
  const updated = await theBlog.save()

  const updatedBlog = await Blog.findById(request.params.id).populate('user', {username: 1, name: 1 })
  return response.json(updatedBlog)
})


module.exports = blogsRouter