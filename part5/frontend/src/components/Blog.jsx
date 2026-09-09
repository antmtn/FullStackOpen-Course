import { useState } from 'react'

const Blog = ({ blog, putBlog, user, deleteBlog }) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)
  const showWhenVisible = { display: detailVisible ? '' : 'none' }

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

  return(
    <div data-testid="blog">
      <div>
        {blog.title} {blog.author}
      </div>
      <div style={showWhenVisible}>
        {blog.url}<br/>
        likes {blogLikes}
        <button
          onClick={handleLike}
          id = 'likeButton'
        >like</button>
        <br/>
        {blog.user.name}
      </div>
      {user && user.username === blog.user.username && detailVisible &&<button onClick = { () => deleteBlog(blog)}>remove</button> }
    </div>
  )
}
export default Blog