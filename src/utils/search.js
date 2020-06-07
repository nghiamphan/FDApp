/**
 * Return a list of threads in given subreddits that contain the searched ticker.
 * @param filter contains two pieces of information to be used in the function: ticker (case insensitive) and subreddits
 * @param data Redux store data that includes threads' post and comments
 * @param {*} includeComments whether to search against the comments
 */

const search = (filter, data, includeComments) => {
	const query = filter.ticker
		? filter.ticker.toLowerCase()
		: ''
	const subs = Object.keys(data)
	let matches = []

	for (let i = 0; i < subs.length; i++) {
		const subreddit = data[subs[i]]
		if (filter.subreddits.includes(subs[i])) {
			for (let j = 0; j < subreddit.data.length; j++) {
				if (subreddit.data[j].title.toLowerCase().match(query)
				|| subreddit.data[j].content.toLowerCase().match(query)) {
					if (includeComments) {
						const filteredComments = subreddit.data[j].comments.filter(comment =>
							comment.content.toLowerCase().match(query)
						)
						matches.push({
							...subreddit.data[j],
							comments: filteredComments,
							subreddit: subs[i],
						})
					} else {
						matches.push({
							...subreddit.data[j],
							comments: [],
							subreddit: subs[i],
						})
					}
				}
			}
		}
	}

	return matches
}

/**
 * Return all tickers appearing in a post and its comments.
 * @param tickers an array of predefined tickers (case sensitive)
 * @param thread data of a post including title, post content and comments
 */

export const searchTicker = (tickers, thread) => {
	const ignored = ['A', 'AN', 'ATH', 'AWAY', 'BUY', 'CEO', 'DD', 'GDP', 'IMO', 'ITM', 'RH', 'YOLO']

	let matches = []
	for (let i=0; i < tickers.length; i++) {
		const ticker = tickers[i]
		if (ignored.includes(ticker))
			continue

		const regex = ` ${ticker}[^a-zA-Z0-9_]+`
		if (thread.title.match(regex)) {
			matches.push(ticker)
			continue
		}
		if (thread.content.match(regex)) {
			matches.push(ticker)
			continue
		}
		const comments = thread.comments
		for (let j = 0; j < comments.length; j++) {
			if (comments[j].content.match(regex)) {
				matches.push(ticker)
				break
			}
		}
	}
	return matches
}

export default search