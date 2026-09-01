import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
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
  render(<Blog blog={blog} user={user} />)

  const titleAndAuthor = screen.getByText('Component testing Joseph Test', {exact: false})
  expect(titleAndAuthor).toBeDefined()
  const url = screen.getByText('Joseph.com', {exact: false})
  expect(url).not.toBeVisible()
  const likes = screen.getByText('likes', {exact: false})
  expect(likes).not.toBeVisible()

})

test('content shown after clicking view button', async() => {
  const sampleUser = {
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
  render(<Blog blog={blog} user={sampleUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('Joseph.com', {exact: false})
  const likes = screen.getByText('likes', {exact: false})

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
})