import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [titleField, setTitleField] = useState('')
  const [authorField, setAuthorField] = useState('')
  const [urlField, setUrlField] = useState('')
  const navigate = useNavigate()
  const handleTitleChange = event => {
    setTitleField(event.target.value)
  }
  const handleAuthorChange = event => {
    setAuthorField(event.target.value)
  }
  const handleUrlChange = event => {
    setUrlField(event.target.value)
  }

  const addBlog = async event => {
    event.preventDefault()
    const blogObject = {
      title:titleField,
      author:authorField,
      url:urlField
    }
    createBlog(blogObject)
    setTitleField('')
    setAuthorField('')
    setUrlField('')
    navigate('/')
  }
  return (
    <form onSubmit = {addBlog}>
      <TextField
        label = 'title:'
        value = { titleField }
        onChange = {handleTitleChange}
        id = 'titleInput'
        margin = 'dense'
        size = 'small'
      />
      <br/>
      <TextField
        label = 'author:'
        value = { authorField }
        onChange = { handleAuthorChange }
        id='authorInput'
        margin = 'dense'
        size = 'small'
      />
      <br/>
      <TextField
        label = 'url:'
        value = {urlField}
        onChange = {handleUrlChange}
        margin = 'dense'
        size = 'small'
      />
      <br/>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        create
      </Button>
    </form>
  )
}

export default BlogForm