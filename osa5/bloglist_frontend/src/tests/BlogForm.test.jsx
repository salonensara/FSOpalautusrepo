import { render, screen } from '@testing-library/react'
import BlogForm from '../components/BlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write a title...')
  const authorInput = screen.getByPlaceholderText('write an author...')
  const urlInput = screen.getByPlaceholderText('write a url...')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testiblogi')
  await user.type(authorInput, 'Erkki Esimerkki')
  await user.type(urlInput, 'www.testi.fi')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testiblogi')
  expect(createBlog.mock.calls[0][0].author).toBe('Erkki Esimerkki')
  expect(createBlog.mock.calls[0][0].url).toBe('www.testi.fi')
})