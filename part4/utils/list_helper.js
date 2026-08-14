const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((sum, blog) => {
    return sum + blog.likes
  },0)

  return likes
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) =>{
    if (blog.likes > max.likes){
      return blog
    }
    return max
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}