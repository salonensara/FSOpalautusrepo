import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          username: <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password: <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login