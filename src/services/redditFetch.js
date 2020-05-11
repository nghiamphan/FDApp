import axios from 'axios'

const baseUrl = 'https://www.reddit.com/r/wallstreetbets.json'

const fetchData = async () => {
	const response = await axios.get(baseUrl)
	return response.data
}

export default {
	fetchData
}