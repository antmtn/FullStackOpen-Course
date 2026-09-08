import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ handleLogout }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    handleLogout()
    navigate('/')
  }
  return (
    <button onClick={handleClick}>Logout</button>
  )
}

export default LogoutButton