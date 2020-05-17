import React from 'react'
import { useSelector } from 'react-redux'

const DisplayResult = () => {
	const filter = useSelector(state => state.filter)
	const dataToDisplay = useSelector(state => {
		return state.data[filter.subreddit]
			?  state.data[filter.subreddit].data
			: []
	})

	return (
		<div>
			{dataToDisplay.map(thread => (
				<div key={thread.id}>
					<h3>{thread.title}</h3>
					Date: {thread.created_utc} &nbsp;
					Ups: {thread.ups} &nbsp;
					Flair: {thread.flair} &nbsp;
					<a href={`https://www.reddit.com${thread.link}`} target="_">Link</a>
					<br/>
					{thread.content_html &&
					<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(thread.content_html, 'text/html').documentElement.textContent }}/>
					}
					<br/>
				</div>
			))
			}
		</div>
	)
}

export default DisplayResult