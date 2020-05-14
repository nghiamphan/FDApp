import axios from 'axios'

const baseUrl = 'https://www.reddit.com'

const fetchSubredditData = async (subreddit, pages, flair) => {
	let aggregateData = []
	let after = ''

	for (let i = 0; i < pages; i++) {
		const url = flair
			? `${baseUrl}/r/${subreddit}/search.json?sort=new&q=flair:${flair}&restrict_sr=on&limit=100&after=${after}`
			: `${baseUrl}/r/${subreddit}.json?limit=100&after=${after}`
		const response = await axios.get(url)
		after = response.data.data.after
		const data = response.data.data.children.map(thread => ({
			id: thread.data.id,
			title: thread.data.title,
			content: thread.data.selftext,
			flair: thread.data.link_flair_text,
			ups: thread.data.ups,
			upvote_ratio: thread.data.upvote_ratio,
			link: thread.data.permalink,
			comments: []
		}))

		const promiseArray = response.data.data.children.map(thread => {
			const threadUrl = baseUrl + thread.data.permalink.substring(0, thread.data.permalink.length-1) + '.json'
			return axios.get(threadUrl)
		})
		const finished = await Promise.all(promiseArray)

		for (let i = 0; i < finished.length; i++) {
			for (let j = 0; j < finished[i].data[1].data.children.length; j++) {
				preorderTreeTraversal(data[i].comments, finished[i].data[1].data.children[j])
			}
		}
		aggregateData = aggregateData.concat(data)
	}

	return aggregateData
}

//////////////////////////////
// Helpers
//////////////////////////////

const preorderTreeTraversal = (array, root) => {
	if (root) {
		if (root.data.body)
			array.push({
				id: root.data.id,
				content: root.data.body,
				ups: root.data.ups,
				link: root.data.permalink
			})
		if (root.data.replies) {
			for (let i = 0; i < root.data.replies.data.children.length; i++) {
				preorderTreeTraversal(array, root.data.replies.data.children[i])
			}
		}
	}
}

export default {
	fetchSubredditData
}