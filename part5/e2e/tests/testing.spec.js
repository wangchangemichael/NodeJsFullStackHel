const { test, expect, beforeEach, describe } = require('@playwright/test')


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    await request.post('/api/users', {
        data: {
          username: 'testuser',                                                                                                             
          name: 'Test User',                                                                                                                
          password: 'testpass'
        }
    })
    await page.goto('/')

    
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })


  describe('login', () => {
    test('succeeds with correct credentials', async ({page}) => {
    await page.locator('input[name="Username"]').fill('testuser')                                                                
    await page.locator('input[name="Password"]').fill('testpass')                                                                
    await page.getByRole('button', { name: 'login' }).click() 

    await expect(page.getByText('Test User logged in', { exact: false })).toBeVisible()  
  })

    test('fails with wrong password', async ({ page }) => {                                                                           
      await page.locator('input[name="Username"]').fill('testuser')                                                                
      await page.locator('input[name="Password"]').fill('wrongpass')                                                                 
      await page.getByRole('button', { name: 'login' }).click()                                                                             
                                                                                                                                                                                                                                                            
      await expect(page.getByText('Wrong username or password')).toBeVisible()                                                              
    }) 

  })

  describe('when logged in', () => {

    beforeEach(async ({page}) => {
      await page.locator('input[name="Username"]').fill('testuser')                                                                       
      await page.locator('input[name="Password"]').fill('testpass')  
      // const loginPromise = page.waitForResponse(res => 
      //   res.url().includes('/api/login') && res.status() === 200
      // );                                                                     
      await page.getByRole('button', { name: 'login' }).click()   
      // await loginPromise;                               
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({page}) => {
      
      await page.getByRole('button', { name: 'create new blog' }).click()                                                                 
                                                                                                                                                                                                                           
      const textboxes = page.getByRole('textbox')                                                                                             
      await textboxes.nth(0).fill('Test Blog Title')                                                                             
      await textboxes.nth(1).fill('Test Author')                                                                                    
      await textboxes.nth(2).fill('http://testurl.com')                                        
                                                                                                                      
      // const createRequest = page.waitForResponse(response => 
      //   response.url().includes('/api/blogs') && response.status() === 201
      // );
                                                                                                                      
      await page.getByRole('button', { name: 'create' }).click()                                                                          
                                                                                                                                          
      // await createRequest                                                                                  
      await expect(page.getByText('Test Blog Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({page}) => {
      await page.getByRole('button', { name: 'create new blog' }).click()                                                                 
                                                                                                                                                                                                                           
      const textboxes = page.getByRole('textbox')                                                                                             
      await textboxes.nth(0).fill('Test Blog Title')                                                                             
      await textboxes.nth(1).fill('Test Author')                                                                                    
      await textboxes.nth(2).fill('http://testurl.com') 

      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()  
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click() 
      await expect(page.getByText('likes 1')).toBeVisible()
    })


    test('the user who created a blog can delete it', async ({ page }) => {                                                                                                                                                                                   
    await page.getByRole('button', { name: 'create new blog' }).click()                                                                   
                                                                                                                                          
    const textboxes = page.getByRole('textbox')                                                                                           
    await textboxes.nth(0).fill('Blog To Delete')                                                                                         
    await textboxes.nth(1).fill('Test Author')                                                                                            
    await textboxes.nth(2).fill('http://testurl.com')                                                                                     
                                                                                                                                          
    const createRequest = page.waitForResponse(response =>                                                                                
      response.url().includes('/api/blogs') && response.status() === 201                                                                  
    )                                                                                                                                     
    await page.getByRole('button', { name: 'create' }).click()                                                                            
    await createRequest                                                                                                                   
                                                                                                                                          
                                                                                                                  
    await expect(page.getByText('Blog To Delete Test Author')).toBeVisible()                                                              
                                                                                                                                          
                                                                                                   
    page.on('dialog', async dialog => {                                                                                                   
      await dialog.accept()                                                                                                   
    })                                                                                                                                    
    
    // await page.getByRole('button', { name: 'view' }).click() 
                                                                                                                
    const deleteRequest = page.waitForResponse(response =>                                                                                
      response.url().includes('/api/blogs') && response.status() === 204                                                                  
    )                                                                                                                                     
    await page.getByRole('button', { name: 'remove' }).click()                                                                            
    await deleteRequest                                                                                                                   
                                                                                                                                          
                                                                                                               
    await expect(page.getByText('Blog To Delete Test Author')).not.toBeVisible()                                                          
  })  
  
  test('only the creator can see the delete button', async ({ page, request }) => {                                                       
                                                                                                         
    await page.getByRole('button', { name: 'create new blog' }).click()                                                                   
                                                                                                                                          
    const textboxes = page.getByRole('textbox')                                                                                           
    await textboxes.nth(0).fill('Blog By User A')                                                                                         
    await textboxes.nth(1).fill('Test Author')                                                                                            
    await textboxes.nth(2).fill('http://testurl.com')                                                                                     
                                                                                                                                          
    const createRequest = page.waitForResponse(response =>                                                                                
      response.url().includes('/api/blogs') && response.status() === 201                                                                  
    )                                                                                                                                     
    await page.getByRole('button', { name: 'create' }).click()                                                                            
    await createRequest                                                                                                                   
                                                                                                                                          
                                                                                             
    await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()                                                              
                                                                                                                                          
                                                                                                                             
    await page.getByRole('button', { name: 'logout' }).click()                                                                            
                                                                                                                                          
                                                                                                                        
    await request.post('/api/users', {                                                                                                    
      data: {                                                                                                                             
        username: 'otheruser',                                                                                                            
        name: 'Other User',                                                                                                               
        password: 'otherpass'                                                                                                             
      }                                                                                                                                   
    })                                                                                                                                    
                                                                                                                                          
                                                                                                                        
    await page.locator('input[name="Username"]').fill('otheruser')                                                                        
    await page.locator('input[name="Password"]').fill('otherpass')                                                                        
                                                                                                                                          
    const loginPromise = page.waitForResponse(res =>                                                                                      
      res.url().includes('/api/login') && res.status() === 200                                                                            
    )                                                                                                                                     
    await page.getByRole('button', { name: 'login' }).click()                                                                             
    await loginPromise                                                                                                                    
                                                                                                                                          
    await expect(page.getByText('Other User logged in')).toBeVisible()                                                                    
                                                                                                                                          
                                                                                                                   
    await expect(page.getByText('Blog By User A Test Author')).toBeVisible()                                                              
                                                                                                                                          
                                                                                                     
    await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()                                                          
  }) 

  test('blogs are arranged in the order according to the likes', async ({page, request}) => {
    await page.getByRole('button', { name: 'create new blog' }).click()                                                                   
    const textboxes1 = page.getByRole('textbox')                                                                                          
    await textboxes1.nth(0).fill('First Blog')                                                                                            
    await textboxes1.nth(1).fill('Author 1')                                                                                              
    await textboxes1.nth(2).fill('http://first.com')                                                                                      
    await page.getByRole('button', { name: 'create' }).click()                                                                            
    await expect(page.getByText('First Blog Author 1')).toBeVisible()                                                                     
                                                                                                                                          
                                                                                                                            
    await page.getByRole('button', { name: 'create' }).click()                                                                   
    const textboxes2 = page.getByRole('textbox')                                                                                          
    await textboxes2.nth(0).fill('Second Blog')                                                                                           
    await textboxes2.nth(1).fill('Author 2')                                                                                              
    await textboxes2.nth(2).fill('http://second.com')                                                                                     
    await page.getByRole('button', { name: 'create' }).click()                                                                            
    await expect(page.getByText('Second Blog Author 2')).toBeVisible()                                                                    
                                                                                                                                                                                                                                                                   
    await page.getByRole('button', { name: 'create' }).click()                                                                   
    const textboxes3 = page.getByRole('textbox')                                                                                          
    await textboxes3.nth(0).fill('Third Blog')                                                                                            
    await textboxes3.nth(1).fill('Author 3')                                                                                              
    await textboxes3.nth(2).fill('http://third.com')                                                                                      
    await page.getByRole('button', { name: 'create' }).click()                                                                            
    await expect(page.getByText('Third Blog Author 3')).toBeVisible()                                                                     
                                                                                                                                          
                                                                                                          
    const viewButtons = page.getByRole('button', { name: 'view' })                                                                        
                                                                                                                                          
                                                                                                                
    await viewButtons.first().click()                                                                                                      
    await viewButtons.first().click()                                                                                                      
    await viewButtons.first().click()                                                                                                      
                                                                                                                                          
                                                                                                              
    const secondBlogLikeButton = page.getByText('Second Blog Author 2').locator('..').getByRole('button', { name: 'like' })   
    const likeRequest1 = page.waitForResponse(res =>                                                                                        
        res.url().includes('/api/blogs') && res.status() === 200                                                                              
      )               
    await secondBlogLikeButton.click()       
    await likeRequest1     
    await expect(page.getByText('likes 1').first()).toBeVisible()  
    
    const likeRequest2 = page.waitForResponse(res =>                                                                                        
        res.url().includes('/api/blogs') && res.status() === 200                                                                              
      ) 
    await secondBlogLikeButton.click()         
    await likeRequest2                                                                                           
    await expect(page.getByText('likes 2').first()).toBeVisible()                                                                         
                                                                                                                                          
    
    const thirdBlogLikeButton = page.getByText('Third Blog Author 3').locator('..').getByRole('button', { name: 'like' })     
    const likeRequest3 = page.waitForResponse(res =>                                                                                        
      res.url().includes('/api/blogs') && res.status() === 200                                                                              
    )                 
    await thirdBlogLikeButton.click()   
    await likeRequest3                                                                                                  
    await expect(page.getByText('likes 1')).toBeVisible()                                                                                 
                                                                                                                                          
                                                                                              
    const blogs = page.locator('div[style*="border"]')                                                                
                                                                                                                                          
                                                                                      
    await expect(blogs.nth(0)).toContainText('Second Blog')                                                              
    await expect(blogs.nth(1)).toContainText('Third Blog')                                                               
    await expect(blogs.nth(2)).toContainText('First Blog')




  })
  

     


  }
  )

  
})