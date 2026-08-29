import { useState } from "react"

const Blog = ({ blog, putBlog }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)
  const showWhenVisible = {display: detailVisible ? '' : 'none'}

  const handleLike = () => {
    const nextLikes = blogLikes + 1
    setBlogLikes(nextLikes)

    const blogObject = {
      id: blog.id,
      user: blog.user._id,
      likes: nextLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    putBlog(blogObject)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
  <div style={blogStyle}>
    <div>
    {blog.title} {blog.author}
    <button onClick={()=> setDetailVisible(!detailVisible)}>
      {detailVisible ? 'hide':'view'}
    </button>
    </div>
    <div style={showWhenVisible}>
      {blog.url}<br/>
      likes {blogLikes} <button onClick={handleLike}>like</button><br/>
      {blog.user.name}
    </div>
  </div>  
  )
}

export default Blog