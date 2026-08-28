import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const[user, setUser] = useState(null)
  const [titleField, setTitleField] = useState('')
  const [authorField, setAuthorField] = useState('')
  const [urlField, setUrlField] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title:titleField,
      author:authorField,
      url:urlField
    }
    setTitleField('')
    setAuthorField('')
    setUrlField('')
    try {
    const returnedBlog = await blogService.create(blogObject)
    setMessage(`a new blog ${titleField} by ${authorField} added`)
    setTimeout(() => {
      setMessage(null)
    },5000)
    setBlogs(blogs.concat(returnedBlog))
    } catch {
      setMessage(`problems adding blog`)
      setTimeout(() => {
        setMessage(null)
      },5000)
    }
  }

  const handleTitleChange = event => {
    setTitleField(event.target.value)
  }
  const handleAuthorChange = event => {
    setAuthorField(event.target.value)
  }
  const handleUrlChange = event => {
    setUrlField(event.target.value)
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
      <BlogForm
        addBlog={addBlog}
        titleField={titleField}
        handleTitleChange = {handleTitleChange}
        authorField={authorField}
        handleAuthorChange={handleAuthorChange}
        urlField={urlField}
        handleUrlChange={handleUrlChange}
      />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App