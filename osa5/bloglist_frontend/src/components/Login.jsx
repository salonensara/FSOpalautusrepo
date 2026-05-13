import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()

    handleLogin({
      username: username,
      password: password
    })

    navigate('/')
    setUsername('')
    setPassword('')
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    gap: '10px',
    marginTop: '20px'
  }

  return (
    <div>
      <h2>Log in to application</h2>

      <form onSubmit={onSubmit} style={formStyle}>
        <div>
          <p>Username:</p>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='write a username...'
            style={{ marginBottom: '10px' }}
          />
        </div>
        <div>
          <p>Password:</p>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='write a password...'
            type="password"
            style={{ marginBottom: '10px' }}
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          login
        </Button>
      </form>
    </div>
  )
}

export default Login