import { Box, Button, Card, Link, Typography } from '@mui/material'
import * as React  from 'react'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, likeBlog, user, deleteBlog }) => {
  const navigate = useNavigate()
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

  const card = (
    <React.Fragment>
      <Typography variant="h5" component="div" sx={{ fontWeight:'bold' }}>
        {blog.title}
      </Typography>
      <Typography variant="body1" component="span">
        by <strong>{blog.author}</strong>
      </Typography>
      <Link component="div" variant="body1">{blog.url}</Link>
      <Typography variant="body1">
        Likes: {blog.likes}
        {user &&
        <Button
          onClick={handleLike}
          id='likeButton'
          sx={{ border:1, py:0, mx: 1, minWidth:0 }}
        >
          like
        </Button>
        }
        {user && user.username === blog.user.username &&
        <>
          <br/>
          <Button
            onClick = { handleDelete }
            sx={{ color:'red', border:1, py:0, my:0.5, mx:0 }}
          >
            remove
          </Button>
        </>
        }
      </Typography>
    </React.Fragment>
  )

  return(
    <div data-testid="blog">
      <Box sx={{ minWidth: 275, maxWidth:'40%',my:1 }}>
        <Card variant="outlined" sx={{ px:2, py:2, borderColor:'#6e8fba', borderWidth:2 }}>{card}</Card>
      </Box>
    </div>
  )
}
export default Blog