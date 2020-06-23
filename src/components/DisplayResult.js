import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { filterThreads, searchTickersAndOptions } from '../utils/search'
import { displayDate } from '../utils/dataFormat'
import { toggleDisplayPost, toggleDisplayComments, toggleDisplayChildComments, updateTickersAndOptions } from '../reducers/dataReducer'
import StockQuotes from './StockQuotes'
import OptionQuotes from './OptionQuotes'

const DisplayResult = () => {
	const dispatch = useDispatch()
	const filter = useSelector(state => state.filter)
	const data = useSelector(state => state.data)
	const symbols = useSelector(state => state.companies).map(company => company.symbol)
	const fetchingRedditInProgress = useSelector(state => state.meta.fetching_reddit_in_progress)

	const threadsToDisplay = filterThreads(filter, data)

	const onScrollChange = async (isVisible, thread) => {
		// If thread.tickers == null, the thread's content hasn't been scanned for appearance of tickers and options yet.
		if (isVisible && !thread.tickers) {
			const { tickers, options } = searchTickersAndOptions(symbols, thread)
			dispatch(updateTickersAndOptions(thread.subreddit, thread.id, tickers, options))
		}
	}

	if (threadsToDisplay.length === 0 && filter.subreddits.length !== 0 && !fetchingRedditInProgress) {
		return (
			<div className="red-text">
				No results found.
			</div>
		)
	}

	return (
		<div>
			{threadsToDisplay.map(thread => (
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
									<div dangerouslySetInnerHTML={{ __html: thread.title }}/>
								</a>
							</div>

							<div className="thread-details flex-container">
								<div
									className="thread-detail-item toggle-button"
									onClick={() => dispatch(toggleDisplayPost(thread.subreddit, thread.id))}
								>
									&#91;
									{thread.display_post
										? <FontAwesomeIcon icon={faMinus} size={'sm'} title="Hide Post"/>
										: <FontAwesomeIcon icon={faPlus} size={'sm'} title="Show Post"/>
									}
									&#93;
								</div>

								<div className="thread-detail-item">
									<a
										href={`https://www.reddit.com/user/${thread.author}`}
										target="_blank"
										rel="noopener noreferrer"
										title="Author"
									>
										{thread.author}
									</a>
								</div>

								<div className="thread-detail-item">
									<a
										href={`https://www.reddit.com/r/${thread.subreddit}`}
										target="_blank"
										rel="noopener noreferrer"
										title="Subreddit"
									>
										{thread.subreddit}
									</a>
								</div>

								<div className="thread-detail-item">{displayDate(thread.created_utc)}</div>

								<div className="thread-detail-item" title="Upvotes">
									<FontAwesomeIcon icon={faArrowUp}/>
									&nbsp;{thread.ups} ({thread.upvote_ratio*100}%)
								</div>

								{thread.flair &&
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
								}
							</div>
							{thread.tickers
								? <>
									<StockQuotes tickers={thread.tickers}/>
									<OptionQuotes optionsParam={thread.options}/>
								</>
								: <div>Processing...</div>
							}
						</div>
					</VisibilitySensor>

					{thread.display_post &&
					<div>
						{thread.content_html
							? <div className="thread-post">
								<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(thread.content_html, 'text/html').documentElement.textContent }}/>

								<div
									className="toggle-button"
									onClick={() => dispatch(toggleDisplayComments(thread.subreddit, thread.id))}
								>
									&#91;
									{thread.display_comments
										? <FontAwesomeIcon icon={faMinus} size={'sm'} title="Hide Comments"/>
										: <FontAwesomeIcon icon={faPlus} size={'sm'} title="Show Comments"/>
									}
									&#93;
								</div>
							</div>
							: <div className="thread-post">This post does not have any text...</div>
						}

						{thread.display_comments && (
							thread.comments.length > 0
								? thread.comments.map(comment => (comment.display_self &&
									<div
										key={comment.id}
										className="thread-comment"
										style={{ marginLeft: comment.comment_level * 10 }}
									>
										<div className="comment-details flex-container">
											<div
												className="comment-detail-item toggle-button"
												onClick={() => dispatch(toggleDisplayChildComments(thread.subreddit, thread.id, comment.id))}
											>
												&#91;
												{comment.display_child_comments
													? <FontAwesomeIcon icon={faMinus} size={'sm'} title="Collapse"/>
													: <FontAwesomeIcon icon={faPlus} size={'sm'} title="Expand"/>
												}
												&#93;
											</div>

											<div className="comment-detail-item">
												<a
													href={`https://www.reddit.com/user/${comment.author}`}
													target="_blank"
													rel="noopener noreferrer"
													title="Author"
												>
													{comment.author}
												</a>
											</div>

											<div className="comment-detail-item">{displayDate(comment.created_utc)}</div>

											<div className="comment-detail-item" title="Upvotes">
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

										{comment.display_child_comments &&
										<div dangerouslySetInnerHTML={{ __html: new DOMParser().parseFromString(comment.content_html, 'text/html').documentElement.textContent }}/>
										}
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