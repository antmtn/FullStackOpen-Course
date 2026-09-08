import Blog from './Blog'

const BlogList = ({ blogs, putBlog, user, deleteBlog }) => {
  return(
    blogs.map(blog =>
      <Blog
        key={blog.id}
        blog={blog}
        putBlog={putBlog}
        user={user}
        deleteBlog = {deleteBlog}
      />
    )
  )
}

export default BlogList