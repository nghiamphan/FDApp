import React, { useState, useEffect } from 'react'
import fetchReddit from './services/redditFetch'

const App = () => {
	const [posts, setPosts] = useState([])
	useEffect(() => {
		fetchReddit.fetchSubredditData('wallstreetbets')
			.then(data => setPosts(data.data.children))
	}, [])

	return (
		<div className="App">
			{posts.map(post => (
				<div key={post.data.name}>
					{post.data.title}
					<br/>
					Content: {post.data.selftext}
				</div>
			))}
		</div>
	)
}

export default App
