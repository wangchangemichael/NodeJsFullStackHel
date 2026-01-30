const countBy = require('lodash/countBy')
const toPairs = require('lodash/toPairs')
const maxBy = require('lodash/maxBy')
const groupBy = require('lodash/groupBy')
const map = require('lodash/map')
const { sumBy } = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce( (sum, cur) => {
    return sum + cur.likes
  } , 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, cur) => {
    if (prev === null) {
      return cur
    }
    return cur.likes > prev.likes ? cur : prev
  } , null)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const blogsCount = countBy(blogs, 'author')
  const blogsArr = toPairs(blogsCount)
  const theOne = maxBy(blogsArr, (ele) => ele[1] )
  return {
    author: theOne[0],
    blogs: theOne[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const grouped = groupBy(blogs, 'author')
  const authorLikes = map(grouped, (authorBlogs, author) => {
    return {
      author: author,
      likes: sumBy(authorBlogs, 'likes')
    }
  })
  const theOne = maxBy(authorLikes, 'likes')
  return theOne
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}