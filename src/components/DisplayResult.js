import React from 'react'
import { useSelector } from 'react-redux'
import search from '../utils/search'
import displayDate from '../utils/displayDate'

const DisplayResult = () => {
	const filter = useSelector(state => state.filter)
	const data = useSelector(state => state.data)
	const dataToDisplay = search(filter, data, true)

	return (
		<div>
			{dataToDisplay.map(thread => (
				<div key={thread.id}>
					<h3>{thread.title}</h3>
					Subreddit: {thread.subreddit} &nbsp;
					Date: {displayDate(thread.created_utc)} &nbsp;
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