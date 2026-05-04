import { useState, useEffect } from 'react'
import Blog from './components/Blog'

import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate, useNavigate, useMatch
} from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import Login from './components/Login'
import BlogDetails from './components/BlogDetails'

const App = () => {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [user, setUser] = useState(null)
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(blog => blog.id === match.params.id) : null

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

  const handleLogin = async ({ username, password }) => {
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
      navigate('/')
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
    navigate('/')
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">new blog</Link>}
        {user ? ( <span>
          <button onClick={handleLogout}>logout</button>
          <p>{user.name} logged in</p>
        </span>)
          : (
            <Link style={padding} to="/login">login</Link>
          )}
      </div>
      <Notification message={message} type={messageType} />

      <Routes>
        <Route path="/" element={
          user ? <BlogList blogs={blogs} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
            : <Navigate to="/login" replace />
        } />
        <Route path="/blogs/:id" element={
          blog ? <BlogDetails blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user} />
            : <Navigate to="/login" replace />
        } />
        <Route
          path="/login"
          element={<Login handleLogin={handleLogin} message={message} />}
        />
        <Route path="/create" element={
          <BlogForm createBlog={addBlog}/>
        } />
      </Routes>
    </div>
  )
}

export default App