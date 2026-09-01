import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [titleField, setTitleField] = useState('')
  const [authorField, setAuthorField] = useState('')
  const [urlField, setUrlField] = useState('')
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
  }
  return (
    <form onSubmit = {addBlog}>
      title:
      <input
        value={titleField}
        onChange={handleTitleChange}
        id='titleInput'
      /><br/>
      author:
      <input
        value={authorField}
        onChange={handleAuthorChange}
        id='authorInput'
      /><br/>
      url:
      <input
        value={urlField}
        onChange={handleUrlChange}
        id='urlInput'
      /><br/>
      <button >create</button>
    </form>
  )
}

export default BlogForm