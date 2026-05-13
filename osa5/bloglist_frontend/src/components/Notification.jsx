import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const severity = type === 'error' ? 'error' : 'success'

  return (
    <Alert severity={severity}
      variant= "filled"
      sx={{ marginTop: 2 }}>
      {message}
    </Alert>
  )
}

export default Notification