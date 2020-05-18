import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import search from '../utils/search'
import displayDate from '../utils/displayDate'
import { toggleDisplayPost } from '../reducers/dataReducer'

const DisplayResult = () => {
	const dispatch = useDispatch()
	const filter = useSelector(state => state.filter)
	const data = useSelector(state => state.data)
	const dataToDisplay = search(filter, data, true)

	return (
		<div>
			{dataToDisplay.map(thread => (
				<div key={thread.id} className="post-card">
					<div>
						<button
							className="toggle-button"
							onClick={() => dispatch(toggleDisplayPost(thread.subreddit, thread.id))}
						>
							{thread.display_post
								? <FontAwesomeIcon icon={faChevronDown} title="Hide Post"/>
								: <FontAwesomeIcon icon={faChevronRight} title="Show Post"/>
							}
						</button>
						{thread.title}
					</div>
					{thread.display_post &&
					<div>
						Subreddit: {thread.subreddit} &nbsp;
						Date: {displayDate(thread.created_utc)} &nbsp;
						Ups: {thread.ups} &nbsp;
						Flair: {thread.flair} &nbsp;
						<a href={`https://www.reddit.com${thread.link}`} target="_">Link</a>
						<br/>
						{thread.content_html &&
					<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(thread.content_html, 'text/html').documentElement.textContent }}/>
						}
					</div>
					}
				</div>
			))
			}
		</div>
	)
}

export default DisplayResult