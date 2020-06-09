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
	for (const ticker of tickers) {
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
		for (const comment of comments) {
			if (comment.content.match(regex)) {
				if (ticker !== matches[matches.length-1])
					matches.push(ticker)
				optionMatches = optionMatches.concat(searchOptions(ticker, comment.content))
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