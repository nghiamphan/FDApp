import React from 'react'
import { displayLargeNumber, textColorStyle } from '../utils/dataFormat'
import StockGraph from './StockGraph'

const StockCompactDisplay = ({ stock }) => (
	<div key={stock.ticker} className="stock-quote-card">
		<div className="quote-heading">
			<strong>{stock.ticker}</strong> - {stock.description}
		</div>

		<StockGraph ticker={stock.ticker}/>

		<div className="flex-container">
			<div className="compact-quote-stat">
				<label>Last Price</label>
				<div style={textColorStyle(stock.netChange)}>{stock.lastPrice}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Change</label>
				<div style={textColorStyle(stock.netChange)}>{stock.netChange} ({stock.netPercentChangeInDouble}%)</div>
			</div>

			<div className="compact-quote-stat">
				<label>Previous Close</label>
				<div>{stock.closePrice}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Open</label>
				<div>{stock.openPrice}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Low Today</label>
				<div>{stock.lowPrice}</div>
			</div>

			<div className="compact-quote-stat">
				<label>High Today</label>
				<div>{stock.highPrice}</div>
			</div>
		</div>

		<div className="flex-container">
			<div className="compact-quote-stat">
				<label>52 Weekk Low</label>
				<div>{stock['52WkLow']}</div>
			</div>

			<div className="compact-quote-stat">
				<label>52 Week High</label>
				<div>{stock['52WkHigh']}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Market Cap</label>
				<div>{displayLargeNumber(stock.marketCap)}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Volume</label>
				<div>{displayLargeNumber(stock.totalVolume)}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Price-Earnings Ratio</label>
				<div>{stock.peRatio}</div>
			</div>

			<div className="compact-quote-stat">
				<label>Dividend Yield</label>
				<div>{stock.divYield}</div>
			</div>

			<div className="compact-quote-stat">
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
)

export default StockCompactDisplay