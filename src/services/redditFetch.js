import axios from 'axios'

const baseUrl = 'https://www.reddit.com'

/**
 * Fetch threads from a subreddit, and for each thread, fetch its comments up to level 10. Return the fetch data.
 * @param subreddit the subreddit to be fetched
 * @param pages number of pages to be fetched (each page contains 100 threads)
 * @param flairQuery fetch threads based on their flair (only applicable to WallStreetBets)
 */

const fetchSubredditData = async (subreddit, pages, flairQuery) => {
	let aggregateData = []
	let after = ''

	for (let i = 0; i < pages; i++) {
		let response
		if (flairQuery && flairQuery !== 'All') {
			const url = `${baseUrl}/r/${subreddit}/search.json`
			response = await axios.get(url, {
				params: {
					sort: 'new',
					q: `flair:${flairQuery}`,
					restrict_sr: 'on',
					limit: '100',
					after: after,
				}
			})
		} else {
			const url = `${baseUrl}/r/${subreddit}.json`
			response = await axios.get(url, {
				params: {
					limit: '100',
					after: after,
				}
			})
		}
		after = response.data.data.after

		const data = response.data.data.children.map(thread => ({
			id: thread.data.id,
			title: thread.data.title,
			content: thread.data.selftext,
			content_html: thread.data.selftext_html,
			flair: thread.data.link_flair_text,
			ups: thread.data.ups,
			upvote_ratio: thread.data.upvote_ratio,
			link: thread.data.permalink,
			created_utc: thread.data.created_utc,
			comments: []
		}))

		const promiseArray = response.data.data.children.map(thread => {
			const threadUrl = baseUrl + thread.data.permalink.substring(0, thread.data.permalink.length-1) + '.json?'
			return axios.get(threadUrl)
		})
		const finished = await Promise.all(promiseArray)

		for (let i = 0; i < finished.length; i++) {
			for (let j = 0; j < finished[i].data[1].data.children.length; j++) {
				preorderTreeTraversal(data[i].comments, finished[i].data[1].data.children[j], 0)
			}
		}
		aggregateData = aggregateData.concat(data)
	}

	return aggregateData
}

/**
 * Return flairs of the 100 hottest threads in a subreddit (only applicable to WallStreetBets).
 * @param subreddit
 */

const fetchFlairs = async (subreddit) => {
	let flairs = []
	const response = await axios.get(`${baseUrl}/r/${subreddit}.json`, {
		params: { limit: '100' }
	})
	response.data.data.children.map(thread => {
		const flair = thread.data.link_flair_text
		if (!flairs.includes(flair) && flair) {
			flairs.push(flair)
		}
		return 0
	})
	flairs.sort()

	return flairs
}

//////////////////////////////
// Helpers
//////////////////////////////

const preorderTreeTraversal = (array, root, commentLevel) => {
	if (root) {
		if (root.data.body)
			array.push({
				id: root.data.id,
				content: root.data.body,
				content_html: root.data.body_html,
				ups: root.data.ups,
				link: root.data.permalink,
				created_utc: root.data.created_utc,
				comment_level: commentLevel,
			})
		if (root.data.replies) {
			for (let i = 0; i < root.data.replies.data.children.length; i++) {
				preorderTreeTraversal(array, root.data.replies.data.children[i], commentLevel+1)
			}
		}
	}
}

export default {
	fetchSubredditData,
	fetchFlairs,
}