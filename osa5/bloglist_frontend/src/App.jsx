import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      setMessage(`a new blog ${returnedBlog.title} added`)
      setMessageType('success')
      setTimeout(() => setMessage(null), 5000)
    } catch {
      setMessage('Error adding a blog')
      setMessageType('error')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      const originalBlog = blogs.find(blog => blog.id === id)
      const blogToUpdate = {
        ...returnedBlog,
        user: originalBlog.user
      }
      setBlogs(blogs.map(blog => blog.id !== id ? blog : blogToUpdate))
    } catch {
      setMessageType('error')
      setMessage('Error updating likes')
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)
    const ok = window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`)

    if (ok) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessage('Blog removed successfully')
        setMessageType('success')
        setTimeout(() => setMessage(null), 5000)
      } catch {
        setMessage('Error: only the creator can delete this blog')
        setMessageType('error')
        setTimeout(() => setMessage(null), 5000)
      }
    }
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setMessageType('success')
      setMessage('logged in successfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessageType('error')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessageType(null)
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} type={messageType} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>

          <Togglable buttonLabel="new blog">
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogs
            .toSorted((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog key={blog.id} blog={blog} user={user} updateBlog={updateBlog} deleteBlog={deleteBlog} />
            )}
        </div>
      )}
    </div>
  )
}

export default App