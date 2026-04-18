import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testiblogi',
    author: 'Erkki Esimerkki',
    url: 'www.testiblogi.com',
    likes: 10,
    user: { name: 'Testi' }
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText(/Testiblogi/)).toBeDefined()
  expect(screen.getByText(/Erkki Esimerkki/)).toBeDefined()

  const urlElement = screen.getByText(/www.testiblogi.com/i)
  expect(urlElement).toBeDefined()
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Testiblogi',
    author: 'Erkki Esimerkki',
    url: 'www.testi.fi',
    likes: 5,
    user: { name: 'Testi' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(/www.testi.fi/)).toBeDefined()
  expect(screen.getByText(/likes 5/)).toBeDefined()
})

test('if like button is clicked twice, the handler is called twice', async () => {
  const blog = {
    title: 'Testiblogi',
    author: 'Erkki Esimerkki',
    url: 'testi.com',
    likes: 0,
    user: { name: 'Testi' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})