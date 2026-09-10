import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import LoginPage from './components/LoginPage'
import LogoutButton from './components/LogoutButton'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
} from 'react-router-dom'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const[user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

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

  return (
    <Router>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {!user &&
        <Link style={padding} to="/login">login</Link>}
        {user && <LogoutButton handleLogout={handleLogout}/>}
      </div>
      <Routes>
        <Route path="/" element= {
          <BlogList
            blogs={ blogs }
          />
        }/>
        <Route path="/login" element={
          <LoginPage
            message={message}
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        }/>
        <Route path="/blogs/:id" element={
          <Blog
            blogs={blogs}
            likeBlog={likeBlog}
            user={user}
            deleteBlog={deleteBlog}
          />
        }
        />
      </Routes>
    </Router>
  )
}

export default App