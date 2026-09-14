import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const LoginForm = (props) => {
  const navigate = useNavigate()
  const handleLogin = async(event) => {
    let result = await props.handleLogin(event)
    if (result)
      navigate('/')
  }
  return(
    <form onSubmit = {handleLogin}>
      <div>
        <TextField
          label = 'username'
          value = { props.username }
          onChange={({ target }) => props.setUsername(target.value)}
          variant = 'standard'
          margin = 'dense'
        />
      </div>
      <TextField
        label = 'password'
        value = { props.password }
        onChange={({ target }) => props.setPassword(target.value)}
        variant = 'standard'
        margin = 'dense'
      />
      <br/>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        login
      </Button>
    </form>
  )}
export default LoginForm