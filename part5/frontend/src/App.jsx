import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginPage from './components/LoginPage'
import LogoutButton from './components/LogoutButton'
import {
  Routes, Route, Link, useMatch,
} from 'react-router-dom'
import { Container, Alert, AppBar, Toolbar, Button, Typography } from '@mui/material'

const Notification = ({ message }) => {
  if (message === null){
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }}>
      {message}
    </Alert>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const[user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const buttonStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes-a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setMessage(null)
      },5000)
    } catch {
      setMessage('problems adding blog')
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const likeBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.like(blogObject)
      const prevBlog = blogs.find((blog) => (blog.id === returnedBlog.id))
      const newBlog = { ...prevBlog, likes: returnedBlog.likes }
      setBlogs(blogs.map(b => b.id === returnedBlog.id ? newBlog : b).sort((a,b) => b.likes-a.likes))
    } catch {
      setMessage('problems updating blog')
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)){
      try{
        blogService.deleteBlog(blogObject.id)
        setMessage(`blog ${blogObject.title} by ${blogObject.author} deleted`)
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
        setTimeout(() => {
          setMessage(null)
        },5000)
      } catch {
        setMessage('problems deleting blog')
        setTimeout(() => {
          setMessage(null)
        },5000)
      }
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      return true
    } catch {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      },5000)
      return false
    }
  }

  const padding = {
    padding: '0px 5px',
  }

  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    :null

  return (
    <Container>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>Blog App</Typography>
            <Button color="inherit" component={Link} to="/" sx={buttonStyle}>blogs</Button>
            <Button color="inherit" component={Link} to="/create" sx={buttonStyle}>new blog</Button>
            {!user &&
            <Button color="inherit" component={Link} to="/login" sx={buttonStyle}>login</Button>}
            {user &&
            <LogoutButton handleLogout={handleLogout} sx={buttonStyle}/>}
          </Toolbar>
        </AppBar>
      </div>
      <Notification message={message}/>
      <Routes>
        <Route path="/" element= {
          <BlogList
            blogs={ blogs }
          />
        }/>
        <Route path="/login" element={
          <LoginPage
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        }/>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            likeBlog={likeBlog}
            user={user}
            deleteBlog={deleteBlog}
          />
        }
        />
        <Route path ="/create" element={
          <>
            <h2>create new</h2>
            <BlogForm createBlog={createBlog}/>
          </>
        }
        />
      </Routes>
    </Container>
  )
}

export default App