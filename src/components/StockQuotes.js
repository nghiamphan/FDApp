import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import stockService from '../services/stockService'

const StockQuotes = ({ tickers }) => {
	const [stocks, setStocks] = useState({})

	const onClickTicker = async ticker => {
		const quote = await stockService.fetchQuote(ticker)
		if (quote[ticker]) {
			const newState = { ...stocks }
			newState[ticker] = { ...quote[ticker] , show: true }
			setStocks(newState)
		}
	}

	const onCloseTicker = ticker => {
		const newState = { ...stocks }
		newState[ticker].show = false
		setStocks(newState)
	}

	return (
		<div>
			Mentioned tickers:
			{(tickers && tickers.length > 0) &&
			<span>{tickers.map(ticker => (stocks[ticker] && stocks[ticker].show)
				? <div key={ticker} className="stock-quote-card">
					<div className="quote-heading">
						<strong>{ticker}</strong> - {stocks[ticker].description}
						<span className="quote-close-btn" onClick={() => onCloseTicker(ticker)}>
							<FontAwesomeIcon icon={faTimes}/>
						</span>
					</div>

					<div className="flex-container">
						<div className="quote-stat">
							<label>Last Price</label>
							<div>{stocks[ticker].lastPrice}</div>
						</div>

						<div className="quote-stat">
							<label>Change</label>
							<div>{stocks[ticker].netChange} ({stocks[ticker].netPercentChangeInDouble}%)</div>
						</div>

						<div className="quote-stat">
							<label>Previous Close</label>
							<div>{stocks[ticker].closePrice}</div>
						</div>

						<div className="quote-stat">
							<label>Open</label>
							<div>{stocks[ticker].openPrice}</div>
						</div>
					</div>

					<div className="flex-container">
						<div className="quote-stat">
							<label>Low Today</label>
							<div>{stocks[ticker].lowPrice}</div>
						</div>

						<div className="quote-stat">
							<label>High Today</label>
							<div>{stocks[ticker].highPrice}</div>
						</div>

						<div className="quote-stat">
							<label>52 Weekk Low</label>
							<div>{stocks[ticker]['52WkLow']}</div>
						</div>

						<div className="quote-stat">
							<label>52 Week High</label>
							<div>{stocks[ticker]['52WkHigh']}</div>
						</div>
					</div>

					<div className="flex-container">
						<div className="quote-stat">
							<label>Price-Earnings Ratio</label>
							<div>{stocks[ticker].peRatio}</div>
						</div>

						<div className="quote-stat">
							<label>Dividend Yield</label>
							<div>{stocks[ticker].divYield}</div>
						</div>

						<div className="quote-stat">
							<a
								href={`https://robinhood.com/stocks/${ticker}`}
								target="_blank"
								rel="noopener noreferrer"
							>
						Robinhood
							</a>
						</div>

						<div className="quote-stat">
							<a
								href={`https://finance.yahoo.com/quote/${ticker}`}
								target="_blank"
								rel="noopener noreferrer"
							>
						Yahoo Finance
							</a>
						</div>
					</div>

				</div>
				: <span key={ticker} onClick={() => onClickTicker(ticker)}>&nbsp; {ticker}</span>
			)}
			</span>
			}
		</div>
	)}

export default StockQuotes