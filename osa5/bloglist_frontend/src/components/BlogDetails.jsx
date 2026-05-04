import React from 'react'
import { useNavigate } from 'react-router-dom'


const BlogDetails = ({ blog, updateBlog, deleteBlog, user }) => {
  const navigate = useNavigate()
  if (!blog) {
    return null
  }

  const handleLike = () => {
    const updatedBlog = {
      user: blog.user?.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        {user && (
          <button onClick={handleLike} style={{ marginLeft: 5 }}>
            like
          </button>
        )}
      </div>
      <div>
        added by {blog.user?.name || 'anonymous'}
      </div>
      <button onClick={() => handleDelete(blog.id)}>remove</button>
    </div>
  )
}

export default BlogDetails