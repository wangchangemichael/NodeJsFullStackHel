import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }catch {
      showNotification('Wrong username or password', 'error')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const LoginForm = () => {
    return (
      <form onSubmit={handleLogin} >
        <div>
        username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)} />
        </div>

        <div>
        password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)} />
        </div>

        <button type="submit">login</button>

      </form>

    )

  }

  const blogList = () => (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel='create new blog'>
        <BlogForm createBlog={handleCreateBlog}/>
      </Togglable>

      {blogs.slice().sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={handleUpdateBlog} deleteBlog={handleDeleteBlog} user={user}/>
      )}
    </div>
  )

  const handleUpdateBlog = async (id, blogObject) => {
    const updatedBlog = await blogService.update(id, blogObject)
    setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog))
  }

  const handleDeleteBlog = async (id, title) => {
    if (window.confirm(`Remove blog ${title}?`)) {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !==id))
    }
  }

  const handleCreateBlog = async (blog) => {
    const createdBlog = await blogService.create(blog)
    setBlogs(blogs.concat(createdBlog))
    showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  }


  const showNotification = (message, type = 'success') => {
    setNotification({ message,type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification}/>
      {user === null? LoginForm() : blogList()}
    </div>
  )
}

export default App