const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Pear Shah',
        username: 'pear.shah',
        password: 'Shah'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const title = page.getByText('Log in to application')
    const username = page.getByLabel('username')
    const password = page.getByLabel('password')
    await expect(title).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'pear.shah', 'Shah')
      await expect(page.getByText('Pear Shah logged in')).toBeVisible()
    })
  
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'pear.shah', 'wrong')
  
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'pear.shah', 'Shah')
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'author', 'blog.com')
      await expect(page.getByText('test title author')).toBeVisible()
    })
    test('created blog can be liked', async ({ page }) => {
      await createBlog(page, 'test title', 'author', 'blog.com')
      await page.getByRole('button', { name: 'view' }).click()
      const likesContainer = page.getByText('likes')
      await expect(likesContainer).toContainText('likes 0')
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1').waitFor()
    })
  })

})