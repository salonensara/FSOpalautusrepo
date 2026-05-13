import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) =>  {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    navigate('/')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <p>Title:</p>
          <TextField
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder='write a title...'
            style={{  marginBottom: '10px' }}
          />
        </div>
        <div>
          <p>Author:</p>
          <TextField
            value={author}
            onChange={event => setAuthor(event.target.value)}
            placeholder='write an author...'
            style={{  marginBottom: '10px' }}
          />
        </div>
        <div>
          <p>Url:</p>
          <TextField
            value={url}
            onChange={event => setUrl(event.target.value)}
            placeholder='write a url...'
            style={{  marginBottom: '10px' }}
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          create
        </Button>
      </form>
    </div>

  )}

export default BlogForm