import axios from 'axios'

// const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  console.log('Setting token', newToken)
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (blog) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  console.log('Token: ', token)

  const request = await axios.post(baseUrl, blog, config)

  return request.data
}

export default {getAll, create, setToken}