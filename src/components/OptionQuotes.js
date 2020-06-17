import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import stockService from '../services/stockService'

const OptionQuotes = ({ optionsParam }) => {
	/**
	 * @constant options is an array of option position, each contains information of that option position to be displayed.
	 * Initially, each item in @constant options is an option object:
	 * 	{ @constant ticker, @constant type, @constant strike, @constant date, @constant display}
	 * whereas @constant display (@default false) signifies if the position's data will be displayed.
	 *
	 * @constant display is toggled on and off by @function onOpenOptionDisplay and @function onCloseOptionDisplay.
	 *
	 * In @function onOpenOptionDisplay, additional data for an option position will be fetched, and that option object will be updated with those additional properties.
	 */
	const [options, setOptions] = useState([])
	useEffect(() => {
		if (optionsParam) {
			const initialOptions = optionsParam.map(option => ({ ...option, display: false }))
			setOptions(initialOptions)
		}
	}, [optionsParam])

	const onOpenOptionDisplay = async index => {
		const option = options[index]
		const response = await stockService.fetchOptions(option.ticker, option.type, option.strike, option.date)
		if (response) {
			const newOptions = options.map((option, i) => i === index
				? { ...response[0], display: true }
				: option
			)
			setOptions(newOptions)
		} else {
			const newOptions = options.filter((option, i) => i !== index)
			setOptions(newOptions)
			alert(`The option position: ${option.ticker} ${option.type} $${option.strike} ${option.date} is invalid!`)
		}
	}

	const onCloseOptionDisplay = index => {
		const newOptions = options.map((option, i) => i === index
			? { ...option, display: false }
			: option
		)
		setOptions(newOptions)
	}

	return (
		<div className="option-quotes-div">
			{(options && options.length > 0) &&
			<div className="flex-container">
				<div className="positions-label">Positions:</div>
				<div>
					{options.map((option, index) => (
						<div key={index}>
							{option.display
								? <div className="option-display-open">
									<div>
										<span className="option-position">
											{option.ticker} &nbsp; {option.type} &nbsp; ${option.strike} &nbsp; {option.date}
										</span>

										Stock: {option.stockPrice} ({option.stockChange}, {option.stockPercentChange}%)

										<span className="quote-close-btn" onClick={() => onCloseOptionDisplay(index)}>
											<FontAwesomeIcon icon={faTimes}/>
										</span>
									</div>

									<div className="flex-container">
										<div className="option-stat">
											<label>Last</label>
											<div>{option.last}</div>
										</div>

										<div className="option-stat">
											<label>Change</label>
											<div>{option.percentChange}%</div>
										</div>

										<div className="option-stat">
											<label>Bid</label>
											<div>{option.bid} x {option.bidSize}</div>
										</div>

										<div className="option-stat">
											<label>Ask</label>
											<div>{option.ask} x {option.askSize}</div>
										</div>

										<div className="option-stat">
											<label>Volume</label>
											<div>{option.volume}</div>
										</div>

										<div className="option-stat">
											<label>Open Int.</label>
											<div>{option.openInterest}</div>
										</div>

										<div className="option-stat">
											<label>Low</label>
											<div>{option.low}</div>
										</div>

										<div className="option-stat">
											<label>High</label>
											<div>{option.high}</div>
										</div>

										<div className="option-stat">
											<label>Prev. Close</label>
											<div>{option.previousClose}</div>
										</div>
									</div>

									<div className="flex-container">
										<div className="option-stat">
											<label>IV</label>
											<div>{option.volatility}</div>
										</div>

										<div className="option-stat">
											<label>Delta</label>
											<div>{option.delta}</div>
										</div>

										<div className="option-stat">
											<label>Gamma</label>
											<div>{option.gamma}</div>
										</div>

										<div className="option-stat">
											<label>Theta</label>
											<div>{option.theta}</div>
										</div>

										<div className="option-stat">
											<label>Vega</label>
											<div>{option.vega}</div>
										</div>

										<div className="option-stat">
											<label>Rho</label>
											<div>{option.rho}</div>
										</div>

										<div className="option-stat">
											<a
												href={`https://robinhood.com/stocks/${option.ticker}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Robinhood
											</a>
											<br/>
											<a
												href={`https://finance.yahoo.com/quote/${option.ticker}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Yahoo Finance
											</a>
										</div>
									</div>
								</div>
								: <span
									className="option-display-close"
									onClick={() => onOpenOptionDisplay(index)}
								>
									{option.ticker} &nbsp; {option.type} &nbsp; ${option.strike} &nbsp; {option.date}
								</span>
							}
						</div>
					))}
				</div>
			</div>
			}
		</div>
	)
}

export default OptionQuotes