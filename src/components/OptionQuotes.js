import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const OptionQuotes = ({ options }) => {
	let initialDisplays = []
	if (options) {
		for (let i = 0; i < options.length; i++)
			initialDisplays.push(false)
	}

	const [optionDisplays, setOptionDisplays] = useState(initialDisplays)

	const onOpenOptionDisplay = index => {
		const newState = { ...optionDisplays }
		newState[index] = true
		setOptionDisplays(newState)
	}

	const onCloseOptionDisplay = index => {
		const newState = { ...optionDisplays }
		newState[index] = false
		setOptionDisplays(newState)
	}

	return (
		<div className="option-quotes-div">
			{(options && options.length > 0) &&
			<div className="flex-container">
				<div className="positions-label">Positions:</div>
				<div>
					{options.map((option, index) => (
						<div key={index}>
							{optionDisplays[index]
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