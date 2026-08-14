const _ = require('lodash')

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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  let authorCounts = _.countBy(blogs, (blog) => {
    return blog.author
  })
  console.log(authorCounts)
  let pairCounts = _.toPairs(authorCounts)
  let maxAuthor = _.maxBy(pairCounts, (pair) => pair[1])
  console.log(maxAuthor)
  return {
    'author': maxAuthor[0],
    'blogs' : maxAuthor[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}