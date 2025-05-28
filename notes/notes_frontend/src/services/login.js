import axios from 'axios';

const baseUrl = '/api/login'
// const baseUrl = 'http://localhost:3001/api/login'

/**
 * Login in API using login form credentials
 * @param credentials
 * @returns {Promise<any>}
 */
const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)

  return response.data
}

export default {login}