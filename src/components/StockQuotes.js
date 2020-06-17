import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import stockService from '../services/stockService'
import { displayLargeNumber, textColorStyle } from '../utils/dataFormat'

const StockQuotes = ({ tickers }) => {
	/**
	 * @constant stocks is an array of stock objects, each contains information of a stock to be displayed.
	 * Initially, each item in @constant stocks is an object:
	 * 	{ @constant ticker, @constant display}
	 * whereas @constant display (@default false) signifies if the stock's data will be displayed.
	 *
	 * @constant display is toggled on and off by @function onClickTicker and @function onCloseTicker.
	 *
	 * In @function onClickTicker, data for a stock will be fetched, and that stock object will be updated with those additional properties.
	 */
	const [stocks, setStocks] = useState([])
	useEffect(() => {
		if (tickers) {
			const initialStocks = tickers.map(ticker => ({ ticker: ticker, display: false }))
			setStocks(initialStocks)
		}
	}, [tickers])

	const onClickTicker = async ticker => {
		const quote = await stockService.fetchQuote(ticker)
		if (quote) {
			const newStocks = stocks.map(stock => stock.ticker === ticker
				? { ...quote, ticker: ticker, display: true }
				: stock
			)
			setStocks(newStocks)
		}
	}

	const onCloseTicker = ticker => {
		const newStocks = stocks.map(stock => stock.ticker === ticker
			? { ...stock, display: false }
			: stock
		)
		setStocks(newStocks)
	}

	return (
		<div>
			{(stocks.length > 0) &&
			<span>
				<span className="mentioned-tickers-label">Important tickers:</span>
				{stocks.map(stock => stock.display
					? <div key={stock.ticker} className="stock-quote-card">
						<div className="quote-heading">
							<strong>{stock.ticker}</strong> - {stock.description}
							<span className="quote-close-btn" onClick={() => onCloseTicker(stock.ticker)}>
								<FontAwesomeIcon icon={faTimes}/>
							</span>
						</div>

						<div className="flex-container">
							<div className="quote-stat">
								<label>Last Price</label>
								<div style={textColorStyle(stock.netChange)}>{stock.lastPrice}</div>
							</div>

							<div className="quote-stat">
								<label>Change</label>
								<div style={textColorStyle(stock.netChange)}>{stock.netChange} ({stock.netPercentChangeInDouble}%)</div>
							</div>

							<div className="quote-stat">
								<label>Previous Close</label>
								<div>{stock.closePrice}</div>
							</div>

							<div className="quote-stat">
								<label>Open</label>
								<div>{stock.openPrice}</div>
							</div>
						</div>

						<div className="flex-container">
							<div className="quote-stat">
								<label>Low Today</label>
								<div>{stock.lowPrice}</div>
							</div>

							<div className="quote-stat">
								<label>High Today</label>
								<div>{stock.highPrice}</div>
							</div>

							<div className="quote-stat">
								<label>52 Weekk Low</label>
								<div>{stock['52WkLow']}</div>
							</div>

							<div className="quote-stat">
								<label>52 Week High</label>
								<div>{stock['52WkHigh']}</div>
							</div>
						</div>

						<div className="flex-container">
							<div className="quote-stat">
								<label>Volume</label>
								<div>{displayLargeNumber(stock.totalVolume)}</div>
							</div>

							<div className="quote-stat">
								<label>Price-Earnings Ratio</label>
								<div>{stock.peRatio}</div>
							</div>

							<div className="quote-stat">
								<label>Dividend Yield</label>
								<div>{stock.divYield}</div>
							</div>

							<div className="quote-stat">
								<a
									href={`https://robinhood.com/stocks/${stock.ticker}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Robinhood
								</a>
								<br/>
								<a
									href={`https://finance.yahoo.com/quote/${stock.ticker}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Yahoo Finance
								</a>
							</div>
						</div>

					</div>
					: <span
						key={stock.ticker}
						className="mentioned-ticker"
						title="Get more information about this ticker"
						onClick={() => onClickTicker(stock.ticker)}
					>
						{stock.ticker}
					</span>
				)}
			</span>
			}
		</div>
	)}

export default StockQuotes