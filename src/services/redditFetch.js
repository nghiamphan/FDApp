import axios from 'axios'

const baseUrl = 'https://www.reddit.com'

/**
 * Fetch threads from a subreddit, and for each thread, fetch its comments up to level 10. Return an array of threads.
 * @param subreddit the subreddit to be fetched
 * @param pages number of pages to be fetched (each page contains 100 threads)
 * @param query search query
 * @param flair fetch threads based on their flair. Only applicable to WallStreetBets.
 * @param sort sort the fetched threads by: 'new', 'relevance' or 'top'. Only relevant if either query is not null or flair is not null or 'All'.
 * @param time time limit for fetched threads: 'hour', 'day', 'week', 'month', 'year', 'all'. Only relevant if either query is not null or flair is not null or 'All'.
 */

const fetchSubredditData = async (subreddit, pages, query, flair, sort, time) => {
	let returnedThreads = []
	let after // used to fetched multiple pages

	let queryStr
	if (query && flair && flair !== 'All')
		queryStr = `${query} flair:${flair}`
	else if (query)
		queryStr = `${query}`
	else if (flair && flair !== 'All')
		queryStr = `flair:${flair}`

	for (let i = 0; i < pages; i++) {
		let response
		if (queryStr) {
			const url = `${baseUrl}/r/${subreddit}/search.json`
			response = await axios.get(url, {
				params: {
					sort: sort || 'new',
					q: queryStr,
					t: time || 'week',
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

		const savedThread = response.data.data.children.map(thread => ({
			id: thread.data.id,
			subreddit: subreddit,
			author: thread.data.author,
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
			for (const comment of finished[i].data[1].data.children) {
				preorderTreeTraversal(savedThread[i].comments, comment, 0)
			}
		}
		returnedThreads = returnedThreads.concat(savedThread)
	}

	return returnedThreads
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
				author: root.data.author,
				content: root.data.body,
				content_html: root.data.body_html,
				ups: root.data.ups,
				link: root.data.permalink,
				created_utc: root.data.created_utc,
				comment_level: commentLevel,
			})
		if (root.data.replies) {
			for (const childComment of root.data.replies.data.children) {
				preorderTreeTraversal(array, childComment, commentLevel + 1)
			}
		}
	}
}

export default {
	fetchSubredditData,
	fetchFlairs,
}