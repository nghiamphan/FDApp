const search = (query, state, includeComments) => {
	query = query.toLowerCase()
	const subs = Object.keys(state)
	let matches = []

	for (let i = 0; i < subs.length; i++) {
		const subreddit = state[subs[i]]
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
					})
				} else {
					matches.push({
						...subreddit.data[j],
						comments: [],
					})
				}
			}
		}
	}

	return matches
}

export default search