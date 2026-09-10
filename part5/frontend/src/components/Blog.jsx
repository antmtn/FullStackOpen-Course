import { useNavigate, useParams } from 'react-router-dom'

const Blog = ({ blogs, likeBlog, user, deleteBlog }) => {
  const navigate = useNavigate()
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if(!blog)
    return null

  const handleLike = () => {
    if (!user){
      return
    }
    const nextLikes = blog.likes + 1

    const blogObject = {
      id: blog.id,
      user: blog.user._id,
      likes: nextLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    likeBlog(blogObject)
  }

  const handleDelete = () => {
    deleteBlog(blog)
    navigate('/')
  }

  return(
    <div data-testid="blog">
      <div>
        <h2>{blog.title} {blog.author}</h2>
        {blog.url}<br/>
        likes {blog.likes}
        {user &&
        <button
          onClick={handleLike}
          id = 'likeButton'
        >like</button>
        }
        <br/>
        {blog.user.name}
      </div>
      {user && user.username === blog.user.username &&<button onClick = { handleDelete }>remove</button> }
    </div>
  )
}
export default Blog