import { useParams } from 'react-router-dom'

const Blog = ({ blogs, putBlog, user, deleteBlog }) => {
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  if(!blog)
    return null

  console.log(blogs, 'id', id)

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

    putBlog(blogObject)
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
      {user && user.username === blog.user.username &&<button onClick = { () => deleteBlog(blog)}>remove</button> }
    </div>
  )
}
export default Blog