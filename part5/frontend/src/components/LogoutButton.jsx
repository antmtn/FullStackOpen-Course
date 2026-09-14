import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const LogoutButton = ({ handleLogout, sx }) => {
  const navigate = useNavigate()
  const handleClick = () => {
    handleLogout()
    navigate('/')
  }
  return (
    <Button color='inherit' onClick={handleClick} sx={sx}>Logout</Button>
  )
}

export default LogoutButton