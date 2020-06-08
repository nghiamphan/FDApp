import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import search, { searchTicker } from '../utils/search'
import { displayDate } from '../utils/dataFormat'
import { toggleDisplayPost, processTickers, toggleDisplayComments } from '../reducers/dataReducer'
import companies from '../utils/tickers.json'
import StockQuotes from './StockQuotes'

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
							<div className="thread-title">
								<a
									href={`https://www.reddit.com${thread.link}`}
									target="_blank"
									rel="noopener noreferrer"
									title="Go to post in Reddit"
								>
									{thread.title}
								</a>
							</div>

							<div className="thread-details flex-container">
								<button
									className="toggle-button"
									onClick={() => dispatch(toggleDisplayPost(thread.subreddit, thread.id))}
								>
									{thread.display_post
										? <FontAwesomeIcon icon={faChevronDown} title="Hide Post"/>
										: <FontAwesomeIcon icon={faChevronRight} title="Show Post"/>
									}
								</button>

								<div className="thread-subreddit">
									<a
										className="thread-subreddit-link"
										href={`https://www.reddit.com/r/${thread.subreddit}`}
										target="_blank"
										rel="noopener noreferrer"
										title="Subreddit"
									>
										{thread.subreddit}
									</a>
								</div>

								<div className="thread-date">{displayDate(thread.created_utc)}</div>

								<div className="thread-upvotes" title="Upvotes">
									<FontAwesomeIcon icon={faArrowUp}/>
									&nbsp;{thread.ups} ({thread.upvote_ratio*100}%)
								</div>

								<div className="thread-flair">
									<a
										href={`https://www.reddit.com/r/${thread.subreddit}/search?sort=new&restrict_sr=on&q=flair:${thread.flair}`}
										target="_blank"
										rel="noopener noreferrer"
										title="Flair"
									>
										{thread.flair}
									</a>
								</div>
							</div>

							<StockQuotes tickers={thread.tickers}/>
						</div>
					</VisibilitySensor>

					{thread.display_post &&
					<div>
						{thread.content_html
							? <div className="thread-post">
								<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(thread.content_html, 'text/html').documentElement.textContent }}/>

								<button
									className="toggle-button"
									onClick={() => dispatch(toggleDisplayComments(thread.subreddit, thread.id))}
								>
									{thread.display_comments
										? <FontAwesomeIcon icon={faChevronDown} title="Hide Comments"/>
										: <FontAwesomeIcon icon={faChevronRight} title="Show Comments"/>
									}
								</button>
							</div>
							: <div className="thread-post">This post does not have any text...</div>
						}

						{thread.display_comments && (
							thread.comments.length > 0
								? thread.comments.map(comment =>  (
									<div
										key={comment.id}
										className="thread-comment"
										style={{ marginLeft: comment.comment_level * 10 }}
									>
										<div className="comment-details flex-container">
											<div className="comment-date">{displayDate(comment.created_utc)}</div>

											<div className="comment-upvotes" title="Upvotes">
												<FontAwesomeIcon icon={faArrowUp}/>
												&nbsp;{comment.ups}
											</div>

											<div>
												<a
													href={`https://www.reddit.com${comment.link}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													Link
												</a>
											</div>
										</div>

										<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(comment.content_html, 'text/html').documentElement.textContent }}/>
									</div>
								))
								: <div className="thread-comment">No comments yet...</div>
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