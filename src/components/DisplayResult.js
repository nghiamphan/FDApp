import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import search, { searchTicker } from '../utils/search'
import displayDate from '../utils/displayDate'
import { toggleDisplayPost, processTickers, toggleDisplayComments } from '../reducers/dataReducer'
import companies from '../utils/tickers.json'

const DisplayResult = () => {
	const dispatch = useDispatch()
	const filter = useSelector(state => state.filter)
	const data = useSelector(state => state.data)
	const dataToDisplay = search(filter, data, true)
	const tickers = companies.map(company => company.symbol)

	const onScrollChange = (isVisible, thread) => {
		if (isVisible && !thread.tickers)
			dispatch(processTickers(thread.subreddit, thread.id, searchTicker(tickers, thread)))
	}

	return (
		<div>
			{dataToDisplay.map(thread => (
				<div key={thread.id} className="post-card">
					<VisibilitySensor onChange={isVisible => onScrollChange(isVisible, thread)}>
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
							<br/>

							{(thread.tickers && thread.tickers.length > 0) &&
							<>Tickers mentioned: {thread.tickers.map(ticker => <span key={ticker}> {ticker}</span>)}</>
							}
						</div>
					</VisibilitySensor>
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
						<button
							className="toggle-button"
							onClick={() => dispatch(toggleDisplayComments(thread.subreddit, thread.id))}
						>
							{thread.display_comments
								? <FontAwesomeIcon icon={faChevronDown} title="Hide Comments"/>
								: <FontAwesomeIcon icon={faChevronRight} title="Show Comments"/>
							}
						</button>
						{thread.display_comments && (
							thread.comments.length > 0
								? thread.comments.map(comment =>  (
									<div
										key={comment.id}
										style={{ paddingLeft: comment.comment_level * 10 }}
									>
										{comment.content}
									</div>
								))
								: <div>No comments yet</div>
						)}
					</div>
					}
				</div>
			))
			}
		</div>
	)
}

export default DisplayResult