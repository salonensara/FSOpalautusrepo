import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Button, Typography, Paper, Box, Divider, Stack, Link as MuiLink } from '@mui/material'


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

  const canDelete = user && blog.user?.username === user.username

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <strong>{blog.title}</strong>
        </Typography>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          by {blog.author}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2}>
          <Typography variant="body1">
            <MuiLink href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </MuiLink>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">
              {blog.likes} {blog.likes === 1 ? 'like' : 'likes'}
            </Typography>
            {user && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleLike}
              >
                like
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="textSecondary">
            added by <strong>{blog.user?.name || 'anonymous'}</strong>
          </Typography>

          {canDelete && (
            <Box sx={{ pt: 2 }}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleDelete}
              >
                remove blog
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}

export default BlogDetails