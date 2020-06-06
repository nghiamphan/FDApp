import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'
import { updateFilter } from '../reducers/filterReducer'
import { subreddits, wsb } from '../utils/constants'
import companies from '../utils/tickers.json'

const SearchForm = () => {
	const { register, handleSubmit, watch, } = useForm()
	let searchItem = watch('ticker')

	const dispatch = useDispatch()
	const flairs = useSelector(state => state.data[wsb].flairs)

	// Search the searchItem against the list of companies' symbols and names, and return up to the best six matches
	const filter = () => {
		let matches = []
		let goodMatches = 0

		if (searchItem) {
			searchItem = searchItem.toUpperCase()
			for (let i = 0; i < companies.length; i++) {
				const point = companies[i].symbol.indexOf(searchItem)
				if (point >= 0) {
					matches.push({ point: point, company: companies[i] })
					if (point === 0)
						goodMatches++
				} else if (companies[i].name.toUpperCase().includes(searchItem)) {
					matches.push({ point: 10, company: companies[i] })
				}
				if (goodMatches >= 6)
					break
			}
		}
		matches.sort((x, y) => x.point - y.point)
		return matches.slice(0, 6)
	}

	const onSubmit = input => {
		let subredditsToFetch = []
		for (let i = 0; i < subreddits.length; i++) {
			if (input.subreddits[i]) {
				subredditsToFetch.push(subreddits[i])
				subreddits[i] === wsb
					? dispatch(fetchData(subreddits[i], input.pages, input.flair, input.display_post))
					: dispatch(fetchData(subreddits[i], input.pages, null, input.display_post))
			}
		}

		dispatch(updateFilter(input.ticker, subredditsToFetch, input.flair))
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex-container search-form-section">
					<label className="search-form-section-label">Ticker</label>

					<input
						className="search-item-input input-styles"
						list="companies"
						type="text"
						placeholder="Search... (optional)"
						autoComplete="off"
						name="ticker"
						ref={register()}
					/>

					<datalist id="companies">
						{filter().map(match => {
							return(
								<option key={match.company.symbol} value={match.company.symbol}>
									{match.company.name}
								</option>
							)})
						}
					</datalist>
				</div>

				<div className="flex-container search-form-section">
					<label className="subreddits-section-label">Subreddits</label>

					<div className="subreddits-options">
						{subreddits.map((subreddit, index) => (
							<div className="flex-container" key={index}>
								<input
									type="checkbox"
									name={`subreddits[${index}]`}
									ref={register()}
								/>
								<label className="subreddit-option-label">{subreddits[index]}</label>
							</div>
						))
						}
					</div>
				</div>

				<div className="flex-container search-form-section">
					<label className="search-form-section-label">Flair</label>

					<select
						className="flair-select input-styles"
						title="Only applicable to /r/wallstreetbets"
						name="flair"
						ref={register()}
					>
						<option value="All">All</option>
						{flairs.map((flair, index) => (
							<option key={index} value={flair}>{flair}</option>
						))}
					</select>
				</div>

				<div className="flex-container search-form-section">
					<label className="search-form-section-label">Fetched datasize</label>

					<select
						className="datasize-select input-styles"
						title="The amount of threads to be fetched from each subreddit"
						name="pages"
						ref={register()}
					>
						<option title="100 entries" value="1">Small (recommended)</option>
						<option title="200 entries" value="2">Medium</option>
						<option title="300 entries" value="3">Large</option>
					</select>
				</div>

				<div className="flex-container search-form-section">
					<label className="search-form-section-label">Show Post Content</label>

					<input
						type="checkbox"
						title="If chosen, post content will be shown by default"
						name="display_post"
						ref={register()}
					/>
				</div>

				<button className="search-button" type="submit">Search</button>
			</form>
		</div>
	)
}

export default SearchForm