import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import stockService from '../services/stockService'
import { setFetchingStockInProgress } from '../reducers/metaReducer'
import { filterTickers } from '../utils/search'
import { FAILED, NOT_FETCHED } from '../utils/constants'
import SearchRecommendation from './SearchRecommendation'
import StockCompactDisplay from './StockCompactDisplay'
import OptionTable from './OptionTable'

const QuoteSearchForm = () => {
	const [fetchedData, setFetchedData] = useState(null)

	const { register, handleSubmit, watch, } = useForm()
	const optionType = watch('type')
	const searchItem = watch('ticker')
	const companies = useSelector(state => state.companies)

	const dispatch = useDispatch()
	const fetchingStockInProgress = useSelector(state => state.meta.fetching_stock_in_progress)

	const textColorStyle = () => {
		if (!optionType) {
			return {
				color: 'gray',
			}
		}
	}

	const onSubmit = async input => {
		dispatch(setFetchingStockInProgress(true))
		input.ticker = input.ticker.toUpperCase()

		const underlying = await stockService.fetchQuote(input.ticker)
		if (underlying === FAILED) {
			setFetchedData(
				{
					underlying: FAILED,
					positions: NOT_FETCHED,
				})
			dispatch(setFetchingStockInProgress(false))
			return
		}

		const response = {
			underlying: { ...underlying, ticker: input.ticker },
			positions: NOT_FETCHED,
		}

		if (input.type || input.strike || input.fromDate || input.toDate || input.strikeCount) {
			const optionResponse = await stockService.fetchOptions(input.ticker, input.type, input.strike, input.fromDate, input.toDate, input.strikeCount)

			if (optionResponse && optionResponse !== FAILED)
				response.positions = optionResponse.positions
			else
				response.positions = FAILED
		}

		setFetchedData(response)
		dispatch(setFetchingStockInProgress(false))
	}

	return (
		<div className="search-form-div">
			<form className="flex-container" onSubmit={handleSubmit(onSubmit)}>
				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Ticker</label>

						<input
							className="input-text input-styles"
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
							className="input-text input-styles"
							type="number"
							placeholder="optional"
							title="Choose option's strike price"
							min="0.5"
							step="0.5"
							name="strike"
							ref={register()}
						/>
					</div>

					<button
						className="search-button"
						type="submit"
						disabled={!searchItem || fetchingStockInProgress}
					>
						Apply
					</button>

					{fetchingStockInProgress &&
					<span className="search-in-progress red-text">
						Searching in progress...
					</span>
					}
				</div>

				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">From</label>

						<input
							className="input-date input-styles"
							type="date"
							title="Set option's expiration date on or after this date (optional)"
							name="fromDate"
							ref={register()}
						/>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">To</label>

						<input
							className="input-date input-styles"
							type="date"
							title="Set option's expiration date on or before this date (optional)"
							name="toDate"
							ref={register()}
						/>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Strike Count</label>

						<input
							className="input-text input-styles"
							type="number"
							placeholder="optional"
							title="Choose the number of strikes around the in-the-money price. If strike count is specified, the strike input will have no effect."
							min="1"
							step="1"
							name="strikeCount"
							ref={register()}
						/>
					</div>
				</div>

				<SearchRecommendation/>
			</form>

			{fetchedData &&
			(fetchedData.underlying !== FAILED
				? <StockCompactDisplay stock={fetchedData.underlying}/>
				: <div className="red-text">Invalid ticker.</div>
			)}


			{fetchedData && fetchedData.underlying !== FAILED &&
			(fetchedData.positions !== FAILED
				? fetchedData.positions !== NOT_FETCHED && <OptionTable positions={fetchedData.positions}/>
				: <div className="red-text">No options found.</div>
			)}
		</div>
	)
}

export default QuoteSearchForm