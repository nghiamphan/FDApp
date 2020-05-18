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

export default search