import { useNavigate } from 'react-router-dom'
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
        <label>
          username
          <input
            type ="text"
            value ={props.username}
            onChange={({ target }) => props.setUsername(target.value)}
          />
        </label>
      </div>
      <label>
        password
        <input
          type="password"
          value={props.password}
          onChange={({ target }) => props.setPassword(target.value)}
        />
      </label>
      <button type="submit">login</button>
    </form>
  )}
export default LoginForm