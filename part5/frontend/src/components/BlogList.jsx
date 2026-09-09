import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return(
    <>
      <h1>blogs</h1>
      <ul>
        {blogs.map(blog =>
          <li key={blog.id} >
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}

export default BlogList