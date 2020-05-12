import axios from 'axios'

const baseUrl = 'https://www.reddit.com'

const fetchSubredditData = async (sub) => {
	const response = await axios.get(`${baseUrl}/r/${sub}.json`)

	const contentArray = response.data.data.children.map(post => {
		const postUrl = baseUrl + post.data.permalink.substring(0, post.data.permalink.length-1) + '.json'
		return axios.get(postUrl)
	})
	const finished = await Promise.all(contentArray)
	const arr = finished.map(thread => {
		return thread.data[1].data.children.map(comment => comment.data.body)
	})
	return response.data
}

export default {
	fetchSubredditData
}