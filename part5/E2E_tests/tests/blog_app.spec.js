const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Pear Shah',
        username: 'pear.shah',
        password: 'Shah'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const title = page.getByText('Log in to application')
    const username = page.getByLabel('username')
    const password = page.getByLabel('password')
    await expect(title).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
  })

  test('User can log in', async ({ page }) => {
    await loginWith(page, 'pear.shah', 'Shah')
    await expect(page.getByText('Pear Shah logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'pear.shah', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  })
})