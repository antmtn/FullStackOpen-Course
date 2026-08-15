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
  let pairCounts = _.toPairs(authorCounts)
  let maxAuthor = _.maxBy(pairCounts, (pair) => pair[1])
  return {
    'author': maxAuthor[0],
    'blogs' : maxAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const grouped = _.groupBy(blogs, (blog) => {
    return blog.author
  })
  console.log(grouped)
  const summed = _.map(grouped, (blogs, author) => {
    return {
      'author' : author,
      'likes' : _.sumBy(blogs, (blog) => blog.likes)
    }
  })
  console.log(summed)
  const mostLiked = _.maxBy(summed, (author, likes) => author.likes)
  console.log(mostLiked)
  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}