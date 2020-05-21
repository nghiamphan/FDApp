import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VisibilitySensor from 'react-visibility-sensor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import search, { searchTicker } from '../utils/search'
import displayDate from '../utils/displayDate'
import { toggleDisplayPost, processTickers, toggleDisplayComments } from '../reducers/dataReducer'
import stockService from '../services/stockService'
import companies from '../utils/tickers.json'

const DisplayResult = () => {
	const dispatch = useDispatch()
	const filter = useSelector(state => state.filter)
	const data = useSelector(state => state.data)
	const dataToDisplay = search(filter, data, true)
	const tickers = companies.map(company => company.symbol)

	const [stocks, setStocks] = useState({})

	const onScrollChange = (isVisible, thread) => {
		if (isVisible && !thread.tickers)
			dispatch(processTickers(thread.subreddit, thread.id, searchTicker(tickers, thread)))
	}

	const onClickTicker = async ticker => {
		const quote = await stockService.fetchQuote(ticker)
		if (quote[ticker]) {
			const newState = { ...stocks }
			newState[ticker] = { ...quote[ticker] , show: true }
			setStocks(newState)
		}
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
							<>Tickers mentioned: {thread.tickers.map(ticker => (stocks[ticker] && stocks[ticker].show)
								? <div key={ticker}>
									{ticker}
									<br/>
									Last: {stocks[ticker].lastPrice} <br/>
									Change: {stocks[ticker].netChange} ({stocks[ticker].netPercentChangeInDouble}%) <br/>
									Previous Close: {stocks[ticker].closePrice} <br/>
									Open: {stocks[ticker].openPrice} <br/>
									Low: {stocks[ticker].lowPrice} <br/>
									High: {stocks[ticker].highPrice} <br/>
									52wk Low: {stocks[ticker]['52WkHigh']} <br/>
									52wk High: {stocks[ticker]['52WkLow']} <br/>
									P/E: {stocks[ticker].peRatio} <br/>
									Div. Yield: {stocks[ticker].divYield} <br/>
									<a
										href={`https://robinhood.com/stocks/${ticker}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Robinhood
									</a> <br/>
									<a
										href={`https://finance.yahoo.com/quote/${ticker}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										Yahoo Finance
									</a>
								</div>
								: <span key={ticker} onClick={() => onClickTicker(ticker)}> {ticker}</span>
							)}</>
							}
						</div>
					</VisibilitySensor>
					{thread.display_post &&
					<div>
						Subreddit: {thread.subreddit} &nbsp;
						Date: {displayDate(thread.created_utc)} &nbsp;
						Ups: {thread.ups} &nbsp;
						Flair: {thread.flair} &nbsp;
						<a
							href={`https://www.reddit.com${thread.link}`}
							target="_blank"
							rel="noopener noreferrer"
							title="Go to post in Reddit"
						>
							Reddit
						</a>
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