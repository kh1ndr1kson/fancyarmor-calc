import axios from 'axios'

export const HTTP = axios.create({
	baseURL: 'https://fancyarmor.com/api/v1'
})