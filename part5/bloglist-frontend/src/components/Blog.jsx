import { useState } from 'react'
const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleLiking = () => {
    const updatedBlog = {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    deleteBlog(blog.id, blog.title)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
        <div style={{ display: visible ? '' : 'none' }}>
          {blog.url}
          <br/>
          likes {blog.likes} <button onClick={handleLiking}>like</button>
          <br/>
          {blog.user.name}
        </div>
        {blog.user.id ===user.id && (
          <button onClick={handleDelete}>remove</button>
        )}

      </div>
    </div>

  )

}

export default Blog