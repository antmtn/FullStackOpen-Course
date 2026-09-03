const { test, expect, beforeEach, describe } = require('@playwright/test')

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
    await page.getByLabel('username').fill('pear.shah')
    await page.getByLabel('password').fill('Shah')
    await page.getByRole('button', { name:'login' }).click()
    await expect(page.getByText('Pear Shah logged in')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) => {

  })
})