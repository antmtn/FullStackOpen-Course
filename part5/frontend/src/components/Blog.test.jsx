import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

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
  render( <Blog blog={blog} user={user} />)

  const titleAndAuthor = screen.getByText('Component testing Joseph Test', { exact: false })
  expect(titleAndAuthor).toBeDefined()
  const url = screen.getByText('Joseph.com', { exact: false })
  expect(url).not.toBeVisible()
  const likes = screen.getByText('likes', { exact: false })
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

  const url = screen.getByText('Joseph.com', { exact: false })
  const likes = screen.getByText('likes', { exact: false })

  expect(url).toBeVisible()
  expect(likes).toBeVisible()
})
test('like handler is called twice after button clicked twice', async () => {
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
  const mockHandler = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<Blog blog={blog} putBlog={mockHandler} user={sampleUser} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = container.querySelector('#likeButton')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('blog form handler called with correct details when blog created' , async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog}/>)

  const titleInput = container.querySelector('#titleInput')
  const authorInput = container.querySelector('#authorInput')
  const urlInput = container.querySelector('#urlInput')

  await user.type(titleInput, 'Component Testing')
  await user.type(authorInput, 'Joseph Test')
  await user.type(urlInput, 'Joseph.com')

  const createButton = screen.getByText('create')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Component Testing')
  expect(createBlog.mock.calls[0][0].author).toBe('Joseph Test')
  expect(createBlog.mock.calls[0][0].url).toBe('Joseph.com')

})
