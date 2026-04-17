import { useState } from 'react'

const Blog = ({ blog, user, updateBlog, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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

  const [visible, setVisible] = useState(false)

  const label = visible ? 'hide' : 'view'
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showDeleteButton = user && blog.user?.username === user.username

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{label}</button>

      <div style={showWhenVisible}>
        {blog.url}<br />
        likes {blog.likes} <button onClick={handleLike}>like</button><br />
        {blog.user?.name}

        {showDeleteButton && (
          <button onClick={() => deleteBlog(blog.id)}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog