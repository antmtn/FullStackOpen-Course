import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('like and delete not shown to unauthenticated users', () => {
  const user = null
  const blog = {
    title: 'Component testing',
    author: 'Joseph Test',
    url: 'Joseph.com',
    likes: '67',
    user:{
      name:'Joseph A. Test',
      username:'Joe T'
    }
  }
  render( <Blog blog={blog} user={user} />)

  const title = screen.getByText('Component testing', { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText('Joseph Test', { exact: false })
  expect(author).toBeDefined()
  const url = screen.getByText('Joseph.com', { exact: false })
  expect(url).toBeVisible()
  const likes = screen.getByText('likes', { exact: false })
  expect(likes).toBeVisible()

  const likeButton = screen.queryByRole('button', { name: 'like' })
  expect(likeButton).toBeNull()
  const deleteButton = screen.queryByRole('button', { name: 'remove' })
  expect(deleteButton).toBeNull()
})

test('only like button shown to user who did not make a blog', () => {
  const user = {
    name:'Mat Donald',
    username:'Marty Doo'
  }
  const blog = {
    title: 'Component testing',
    author: 'Joseph Test',
    url: 'Joseph.com',
    likes: '67',
    user:{
      name:'Joseph A. Test',
      username:'Joe T'
    }
  }
  render( <Blog blog={blog} user={user} />)

  const title = screen.getByText('Component testing', { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText('Joseph Test', { exact: false })
  expect(author).toBeDefined()
  const url = screen.getByText('Joseph.com', { exact: false })
  expect(url).toBeVisible()
  const likes = screen.getByText('likes', { exact: false })
  expect(likes).toBeVisible()

  const likeButton = screen.getByRole('button', { name: 'like' })
  expect(likeButton).toBeVisible()
  const deleteButton = screen.queryByRole('button', { name: 'remove' })
  expect(deleteButton).toBeNull()
})

test('like button and delete button shown to blog creator', () => {
  const user = {
    name:'Joseph A. Test',
    username:'Joe T'
  }
  const blog = {
    title: 'Component testing',
    author: 'Joseph Test',
    url: 'Joseph.com',
    likes: '67',
    user:{
      name:'Joseph A. Test',
      username:'Joe T'
    }
  }
  render( <Blog blog={blog} user={user} />)

  const title = screen.getByText('Component testing', { exact: false })
  expect(title).toBeDefined()
  const author = screen.getByText('Joseph Test', { exact: false })
  expect(author).toBeDefined()
  const url = screen.getByText('Joseph.com', { exact: false })
  expect(url).toBeVisible()
  const likes = screen.getByText('likes', { exact: false })
  expect(likes).toBeVisible()

  const likeButton = screen.getByRole('button', { name: 'like' })
  expect(likeButton).toBeVisible()
  const deleteButton = screen.getByRole('button', { name: 'remove' })
  expect(deleteButton).toBeVisible()
})