import axios from 'axios'

const axiosDf = axios.create({
	baseURL: 'http://localhost:4200/api/',
	withCredentials: true,
})

export default axiosDf
