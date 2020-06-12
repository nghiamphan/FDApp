import React from 'react'

const OptionQuotes = ({ options }) => {
	return (
		<div>
			{(options && options.length > 0) &&
			<div>
				Positions:
				{options.map((option, index) => (
					<div key={index}>{option.ticker} {option.type} {option.strike} {option.date} {option.last}</div>
				))}
			</div>
			}
		</div>
	)
}

export default OptionQuotes