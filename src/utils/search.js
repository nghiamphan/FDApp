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
 * Return all tickers and option positions appearing in a thread's title, post and comments.
 * More specific: Search a ticker against a thread's title, post and each comment. If it appears in each of these piece of text, search for option position of that ticker in the text that it appears.
 * @param tickers an array of predefined tickers (case sensitive)
 * @param thread data of a post including title, post content and comments
 */

export const searchTicker = (tickers, thread) => {
	const ignored = ['A', 'AN', 'ATH', 'AWAY', 'BUY', 'CEO', 'DD', 'GDP', 'IMO', 'ITM', 'RH', 'YOLO']

	let matches = []
	let optionMatches = []
	for (let i=0; i < tickers.length; i++) {
		const ticker = tickers[i]
		if (ignored.includes(ticker))
			continue

		const regex = ` ${ticker}[^a-zA-Z0-9_]+`
		if (thread.title.match(regex)) {
			matches.push(ticker)
			optionMatches = optionMatches.concat(searchOptions(ticker, thread.title))
		}
		if (thread.content.match(regex)) {
			if (ticker !== matches[matches.length-1])
				matches.push(ticker)
			optionMatches = optionMatches.concat(searchOptions(ticker, thread.content))
		}
		const comments = thread.comments
		for (let j = 0; j < comments.length; j++) {
			if (comments[j].content.match(regex)) {
				if (ticker !== matches[matches.length-1])
					matches.push(ticker)
				optionMatches = optionMatches.concat(searchOptions(ticker, comments[j].content))
			}
		}
	}
	return { tickers: matches, options: optionMatches }
}

/**
 * Return all option positions appearing in a piece of text in either of patterns: SPY 300C 6/19 or SPY 6/19/ 300C.
 * @param ticker
 * @param thread
 */

const searchOptions = (ticker, text) => {
	let optionMatches = []

	const optionPattern1 = `[$]{0,1}${ticker} [$]{0,1}[0-9.]{1,5}[ ]{0,1}(C|P|Call|Put) [0-9]{1,2}[/][0-9]{1,2}([/][0-9]{1,4}){0,1}[^a-zA-Z0-9_/]{1}`
	const optionPattern2 = `[$]{0,1}${ticker} [0-9]{1,2}[/][0-9]{1,2}([/][0-9]{1,4}){0,1} [$]{0,1}[0-9.]{1,5}[ ]{0,1}(C|P|Call|Put)[^a-zA-Z0-9_/{]{1}`
	const patterns = [optionPattern1, optionPattern2]

	for (const pattern of patterns) {
		const regex = new RegExp(pattern, 'gi')
		const matches = text.match(regex)
		if (matches)
			optionMatches = optionMatches.concat(matches)
	}

	return optionMatches
}

export default search