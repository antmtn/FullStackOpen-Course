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

  describe('Login', () => {
  beforeEach(async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
  })
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'pear.shah', 'Shah')
      await expect(page).toHaveURL('/')
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
      await page.getByRole('link', { name: 'login' }).click()
      await loginWith(page, 'pear.shah', 'Shah')
      await expect(page).toHaveURL('/')
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'test title', 'author', 'blog.com')
      await expect(page.getByRole('link', { name: 'test title author' })).toBeVisible()
    })
    test('created blog can be liked', async ({ page }) => {
      await createBlog(page, 'test title', 'author', 'blog.com')
      await page.getByRole('link', { name: 'test title author' }).click()
      const likesContainer = page.getByText('likes')
      await expect(likesContainer).toContainText('likes 0')
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1').waitFor()
    })
    test('user who adds a blog can delete the blog', async ({page}) => {
      await createBlog(page, 'test title', 'author', 'blog.com')
      await page.getByRole('link', { name: 'test title author' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove'}).click()
      
      await expect(page).toHaveURL('/')
      await expect(page.getByRole('link', { name: 'test title author' })).not.toBeVisible()
    })

    // test('only user who adds blog can see the blog delete button', async ({ page, request }) => {
    //   await request.post('/api/users', {
    //   data: {
    //     name: 'Tim Swims',
    //     username: 'tiswi',
    //     password: 'hello'
    //   }
    // })
      
    //   await createBlog(page, 'test title', 'author', 'blog.com')
    //   await page.getByRole('button', { name: 'Logout'}).click()
    //   await page.getByText('Log in').waitFor()
    //   await loginWith(page, 'tiswi', 'hello')
    //   await page.getByRole('button', { name: 'view' }).click()
    //   await expect(page.getByRole('button', { name: 'remove'})).not.toBeVisible()
    // })

    // test('blogs are sorted in order of likes', async ({ page }) => {
    //   await createBlog(page, 'test title 1', 'author', 'blog.com')
    //   await createBlog(page, 'test title 2', 'author', 'blog.com')

    //   await page.getByRole('button', { name: 'view' }).nth(1).click();
    //   for (let i = 0;i < 5; i++){
    //     await page.getByRole('button', { name: 'like' }).click();
    //   }
    //   await page.getByRole('button', { name: 'view' }).click();
    //   await expect(page.getByText('likes').first()).toContainText('likes 5')
    //   await expect(page.getByText('likes').nth(1)).toContainText('likes 0')
      

    // })
  })

})