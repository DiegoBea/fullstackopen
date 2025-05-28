import axios from 'axios'

// const baseUrl = '/api/notes'
const baseUrl = 'http://localhost:3001/api/notes'

/**
 * User token to api request
 * @type string
 */
let token = null

/**
 * Define user token ready for use in the auth header
 * @param newToken
 */
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  // Set request configuration
  const config = {
    headers: {Authorization: token}
  }

  const request = axios.post(baseUrl, newObject, config)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  console.log(`${baseUrl}/${id}`, newObject);
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
  getAll, create, update, setToken
}