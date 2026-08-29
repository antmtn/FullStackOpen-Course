const BlogForm = ({
  addBlog, 
  titleField, 
  handleTitleChange, 
  authorField, 
  handleAuthorChange, 
  urlField, 
  handleUrlChange
  }) => {
  return (
    <form onSubmit = {addBlog}>
        title:
        <input 
          value={titleField}
          onChange={handleTitleChange}
        /><br/>
        author:
        <input
          value={authorField}
          onChange={handleAuthorChange}
        /><br/>
        url:
        <input
          value={urlField}
          onChange={handleUrlChange}
        /><br/>
        <button >create</button>
      </form>
  )
}

export default BlogForm