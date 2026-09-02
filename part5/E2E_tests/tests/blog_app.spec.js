const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
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
})