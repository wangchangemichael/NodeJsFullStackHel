import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


describe('<Blog />', () => {
    const blog = {                                                                                                                        
      id: '12345',                                                                                                                        
      title: 'Testing React Apps',                                                                                                        
      author: 'Test Author',                                                                                                              
      url: 'http://test.com',                                                                                                             
      likes: 5,                                                                                                                           
      user: {                                                                                                                             
        id: 'user123',                                                                                                                    
        name: 'Test User',                                                                                                                
        username: 'testuser'                                                                                                              
      }                                                                                                                                   
    } 
    const user = {                                                                                                                        
      id: 'user123',                                                                                                                      
      name: 'Test User',                                                                                                                  
      username: 'testuser'                                                                                                                
    }  

    test('renders title and author, but not url or likes by default', () => {
        render(<Blog blog={blog} user={user} updateBlog={() =>{}} deleteBlog={() =>{}} />)

        const titleEle = screen.getByText('Testing React Apps', {exact: false})
        const authorEle =  screen.getByText('Test Author',{exact: false})

        expect(titleEle).toBeDefined()
        expect(authorEle).toBeDefined()

        const details = screen.getByText('http://test.com',{exact:false})
        expect(details).toHaveStyle('display: none')
    })

    test('url and likes are shown when view button is clicked', async () => {

        render(<Blog blog={blog} user={user} updateBlog={() =>{}} deleteBlog={() =>{}} />)
        
        const userInstance = userEvent.setup()
        const button = screen.getByText('view')
        await userInstance.click(button)

        expect(screen.getByText('http://test.com', {exact:false})).toBeVisible()
        expect(screen.getByText('likes 5', {exact:false})).toBeVisible()

    })

    test('likes clicks works by clicking twice', async () => {
        
        const mockUpdateHandler = vi.fn()
        render(<Blog blog={blog} user={user} updateBlog={mockUpdateHandler} deleteBlog={()=>{}}/>)

        const userInstance = userEvent.setup()
        const button = screen.getByText('like')
        await userInstance.click(button)
        await userInstance.click(button)

        expect(mockUpdateHandler.mock.calls).toHaveLength(2)

    })

    
})

describe('<BlogForm />', () => {
    test('blog form create blog successfully', async () => {
        const mockCreateBlog = vi.fn()
        render(<BlogForm createBlog={mockCreateBlog} />)

        const userInstance = userEvent.setup()

        const inputs = screen.getAllByRole('textbox')

        const titleInput = inputs[0]
        const authorInput = inputs[1]
        const urlInput = inputs[2]

        await userInstance.type(titleInput, 'New Blog Title')
        await userInstance.type(authorInput, 'New Author')                                                                                    
        await userInstance.type(urlInput, 'http://newblog.com') 

        const button = screen.getByText('create')
        await userInstance.click(button)

        expect(mockCreateBlog.mock.calls).toHaveLength(1)
        expect(mockCreateBlog.mock.calls[0][0]).toEqual({
            title: 'New Blog Title',                                                                                                            
            author: 'New Author',                                                                                                               
            url: 'http://newblog.com' 
        })
        
    })
})
