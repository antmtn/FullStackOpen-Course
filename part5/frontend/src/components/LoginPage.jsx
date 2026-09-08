import LoginForm from './LoginForm'
import Notification from './Notification'

const LoginPage = ({ message, handleLogin, username, password, setUsername, setPassword, user }) => {
  return (
    <div>
      <Notification message={message}/>
      <h2>Log in to application</h2>
      <LoginForm
        handleLogin={handleLogin}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
      />
    </div>
  )
}

export default LoginPage