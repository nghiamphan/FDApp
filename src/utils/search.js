/**
 * Return an array of threads to be displayed based on filtering parameters.
 * @param filter contains two information: subreddits whose threads to be display, and whether to display no-text threads
 * @param data Redux store data that contains fetched threads in format: { 'WallStreetBets' : { threads: [...], }, ... }
 */

export const filterThreads = (filter, data) => {
	let threadsToDisplay = []

	const subreddits = Object.keys(data)

	for (const subreddit of subreddits) {
		if (filter.subreddits.includes(subreddit)) {
			if (filter.show_notext_threads) {
				threadsToDisplay = threadsToDisplay.concat(data[subreddit].threads)
			} else {
				for (const thread of data[subreddit].threads) {
					if (thread.content)
						threadsToDisplay.push(thread)
				}
			}
		}
	}

	return threadsToDisplay
}

/**
 * Return all tickers and option positions appearing in a thread's title, post and comments.
 * More specific: Search a ticker against a thread's title, post and each comment. If it appears in each of these piece of text, search for option position of that ticker in the text that it appears.
 * @param tickers an array of predefined tickers (case sensitive)
 * @param thread data of a post including title, post content and comments
 */

export const searchTickersAndOptions = (tickers, thread) => {
	const ignored = ['A', 'AN', 'ATH', 'AWAY', 'BUY', 'CEO', 'DD', 'GDP', 'IMO', 'ITM', 'RH', 'YOLO']

	let tickerMatches = []
	let optionMatches = []
	for (const ticker of tickers) {
		if (ignored.includes(ticker))
			continue

		const regex = ` ${ticker}[^a-zA-Z0-9_]+`
		if (thread.title.match(regex)) {
			tickerMatches.push(ticker)
			optionMatches = optionMatches.concat(searchOptions(ticker, thread.title))
		}
		if (thread.content.match(regex)) {
			if (ticker !== tickerMatches[tickerMatches.length-1])
				tickerMatches.push(ticker)
			optionMatches = optionMatches.concat(searchOptions(ticker, thread.content))
		}
		const comments = thread.comments
		for (const comment of comments) {
			if (comment.content.match(regex)) {
				if (ticker !== tickerMatches[tickerMatches.length-1])
					tickerMatches.push(ticker)
				optionMatches = optionMatches.concat(searchOptions(ticker, comment.content))
			}
		}
	}
	return { tickers: tickerMatches, options: optionMatches }
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