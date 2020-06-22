import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import stockService from '../services/stockService'
import { textColorStyle } from '../utils/dataFormat'
import { FAILED } from '../utils/constants'

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
		const position = options[index].positions[0]
		const response = await stockService.fetchOptions(position.ticker, position.type, position.strike, position.date, position.date)
		if (response && response !== FAILED) {
			const newOptions = options.map((option, i) => i === index
				? { ...response, display: true }
				: option
			)
			setOptions(newOptions)
		} else if (response && response === FAILED) {
			const newOptions = options.filter((option, i) => i !== index)
			setOptions(newOptions)
			alert(`The option position: ${position.ticker} ${position.type} $${position.strike} ${position.date} is invalid!`)
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
											{option.positions[0].ticker} &nbsp; {option.positions[0].type} &nbsp; ${option.positions[0].strike} &nbsp; {option.positions[0].date}
										</span>

										Stock: &nbsp;
										<span style={textColorStyle(option.underlying.change)}>{option.underlying.last} </span>
										(<span style={textColorStyle(option.underlying.change)}>{option.underlying.change}</span>, <span style={textColorStyle(option.underlying.change)}>{option.underlying.percentChange}%</span>)

										<span className="quote-close-btn" onClick={() => onCloseOptionDisplay(index)}>
											<FontAwesomeIcon icon={faTimes}/>
										</span>
									</div>

									<div className="flex-container">
										<div className="option-stat">
											<label>Last</label>
											<div style={textColorStyle(option.positions[0].percentChange)}>{option.positions[0].last}</div>
										</div>

										<div className="option-stat">
											<label>Change</label>
											<div style={textColorStyle(option.positions[0].percentChange)}>{option.positions[0].percentChange}%</div>
										</div>

										<div className="option-stat">
											<label>Bid</label>
											<div>{option.positions[0].bid} x {option.positions[0].bidSize}</div>
										</div>

										<div className="option-stat">
											<label>Ask</label>
											<div>{option.positions[0].ask} x {option.positions[0].askSize}</div>
										</div>

										<div className="option-stat">
											<label>Volume</label>
											<div>{option.positions[0].volume}</div>
										</div>

										<div className="option-stat">
											<label>Open Int.</label>
											<div>{option.positions[0].openInterest}</div>
										</div>

										<div className="option-stat">
											<label>Low</label>
											<div>{option.positions[0].low}</div>
										</div>

										<div className="option-stat">
											<label>High</label>
											<div>{option.positions[0].high}</div>
										</div>

										<div className="option-stat">
											<label>Prev. Close</label>
											<div>{option.positions[0].previousClose}</div>
										</div>
									</div>

									<div className="flex-container">
										<div className="option-stat">
											<label>IV</label>
											<div>{option.positions[0].volatility}</div>
										</div>

										<div className="option-stat">
											<label>Delta</label>
											<div>{option.positions[0].delta}</div>
										</div>

										<div className="option-stat">
											<label>Gamma</label>
											<div>{option.positions[0].gamma}</div>
										</div>

										<div className="option-stat">
											<label>Theta</label>
											<div>{option.positions[0].theta}</div>
										</div>

										<div className="option-stat">
											<label>Vega</label>
											<div>{option.positions[0].vega}</div>
										</div>

										<div className="option-stat">
											<label>Rho</label>
											<div>{option.positions[0].rho}</div>
										</div>

										<div className="option-stat">
											<a
												href={`https://robinhood.com/stocks/${option.positions[0].ticker}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												Robinhood
											</a>
											<br/>
											<a
												href={`https://finance.yahoo.com/quote/${option.positions[0].ticker}`}
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
									{option.positions[0].ticker} &nbsp; {option.positions[0].type} &nbsp; ${option.positions[0].strike} &nbsp; {option.positions[0].date}
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