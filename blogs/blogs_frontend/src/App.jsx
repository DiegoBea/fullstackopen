import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser'))

    if (loggedUser) {
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, []);

  const handleForm = async (event) => {
    event.preventDefault()

    const blogObject = {title: title, author: author, url: url}

    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const BlogsList = () => {
    return <>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog}/>
      )}
    </>
  }

  const BlogForm = () => {
    return <>
      <h2>Create new</h2>
      <form onSubmit={handleForm}>
        <div>
          title:
          <input type='text' name='title' value={title} onChange={({target}) => setTitle(target.value)}/>
        </div>
        <div>
          author:
          <input type='text' name='author' value={author} onChange={({target}) => setAuthor(target.value)}/>
        </div>
        <div>
          url:
          <input type='text' name='url' value={url} onChange={({target}) => setUrl(target.value)}/>
        </div>
        <button type='submit'>Create</button>
      </form>
    </>
  }

  const LoginForm = () => {
    return <>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type='text' name='username' value={username} onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input type='password' name='password' value={password} onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type='submit'>Login</button>
      </form>
    </>
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('Logging...')

    try {
      // Try login
      const user = await loginService.login({username, password})

      // Save data in localStorage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      // Set token
      blogService.setToken(user.token)

      // Set data
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('Wrong credentials')
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedUser')
  }

  const MainView = () => {
    return <>
      <h2>Blogs</h2>
      {BlogForm()}
      {BlogsList()}
    </>
  }

  return (
    <div>
      {user === null
        ? LoginForm()
        : <div>
          {user.name} logged
          <button onClick={handleLogout}>Logout</button>
          {MainView()}
        </div>
      }
    </div>
  )
}

export default App