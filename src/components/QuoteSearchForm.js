import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { filterTickers } from '../utils/search'

const QuoteSearchForm = () => {
	const { register, handleSubmit, watch, } = useForm()
	const optionType = watch('type')
	const searchItem = watch('ticker')
	const companies = useSelector(state => state.companies)

	const textColorStyle = () => {
		if (!optionType) {
			return {
				color: 'gray',
			}
		}
	}

	const onSubmit = input => {
		console.log(input)
	}

	return (
		<div className="search-form-div">
			<form className="flex-container" onSubmit={handleSubmit(onSubmit)}>
				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Ticker</label>

						<input
							className="search-item-input input-styles"
							list="companies"
							type="text"
							placeholder="required"
							autoComplete="off"
							name="ticker"
							ref={register()}
						/>

						<datalist id="companies">
							{filterTickers(searchItem, companies).map(match => {
								return(
									<option key={match.company.symbol} value={match.company.symbol}>
										{match.company.name}
									</option>
								)})
							}
						</datalist>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Type</label>

						<select
							className="input-styles"
							title="Choose option type"
							defaultValue=""
							style={textColorStyle()}
							name="type"
							ref={register()}
						>
							<option className="gray-text" value="">optional</option>
							<option className="white-text" value="ALL">All</option>
							<option className="white-text" value="CALL">Call</option>
							<option className="white-text" value="PUT">Put</option>
						</select>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Strike</label>

						<input
							className="search-item-input input-styles"
							type="number"
							placeholder="optional"
							title="Choose option's strike price"
							name="strike"
							ref={register()}
						/>
					</div>

					<button
						className="search-button"
						type="submit"
						disabled={!searchItem}
					>
						Apply
					</button>
				</div>

				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">From</label>

						<input
							className="search-item-input input-styles"
							type="date"
							title="Set option's expiration date on or after this date (optional)"
							name="fromDate"
							ref={register()}
						/>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">To</label>

						<input
							className="search-item-input input-styles"
							type="date"
							title="Set option's expiration date on or before this date (optional)"
							name="toDate"
							ref={register()}
						/>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Strike Count</label>

						<input
							className="search-item-input input-styles"
							type="number"
							placeholder="optional"
							title="Choose the number of strikes around the in-the-money price"
							name="strikeCount"
							ref={register()}
						/>
					</div>
				</div>
			</form>
		</div>
	)
}

export default QuoteSearchForm