import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const[user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const loginForm = () => (
  <form onSubmit = {handleLogin}>
        <div>
          <label>
            username
            <input
              type ="text"
              value ={username}
              onChange={({target}) => setUsername(target.value)}
            />
          </label>
        </div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({target}) => setPassword(target.value)}
            />
          </label>
          <button type="submit">login</button>
      </form>
  )

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try{
       const user = await loginService.login({ username, password})
       setUser(user)
       setUsername('')
       setPassword('')
    } catch {
      alert("wrong credentials")
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      {!user &&<h2>Login</h2>}
      {!user && loginForm()}
      
    </div>
  )
}

export default App