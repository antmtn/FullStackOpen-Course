import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

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
    const returnedBlog = await blogService.put(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setMessage(null)
    },5000)
    } catch {
      setMessage(`problems adding blog`)
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const putBlog = async (blogObject) => {
    try {
    const returnedBlog = await blogService.put(blogObject)
    const prevBlog = blogs.find((blog) => (blog.id === returnedBlog.id))
    const newBlog = {...prevBlog, likes: returnedBlog.likes}
    setBlogs(blogs.map(b => b.id === returnedBlog.id ? newBlog : b).sort((a,b) => b.likes-a.likes))
    } catch {
      setMessage(`problems updating blog`)
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try{
       const user = await loginService.login({ username, password})
       setUser(user)
       setUsername('')
       setPassword('')
       window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
       )
       blogService.setToken(user.token)
    } catch {
      setMessage("wrong username or password")
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  if(user === null){
    return(
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

  return (
    <div>
      <Notification message={message}/>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </p>

      <h2>create new</h2>
      <Togglable
        openLabel="create new blog"
        closeLabel="cancel"
      >
        <BlogForm
          createBlog={createBlog}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} putBlog={putBlog}/>
      )}
    </div>
  )
}

export default App