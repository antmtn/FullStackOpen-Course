import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs, putBlog, user, deleteBlog }) => {
  return(
    <>
      <h1>blogs</h1>
      <ul>
        {blogs.map(blog =>
          <li>
            <Link key={blog.id} to={`/blogs/${blog.id}`}>
              <Blog
                blog={blog}
                putBlog={putBlog}
                user={user}
                deleteBlog = {deleteBlog}
              />
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}

export default BlogList