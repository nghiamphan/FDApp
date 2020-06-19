import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'
import { updateFilter } from '../reducers/filterReducer'
import { setSearchingInProgress } from '../reducers/metaReducer'
import { SUBREDDITS, WSB } from '../utils/constants'
import SearchRecommendation from './SearchRecommendation'

const KEY = 'fdapp_reddit_form_params'

const SearchForm = () => {
	const [error, setError] = useState(false)

	const storedParams = JSON.parse(window.localStorage.getItem(KEY))
	const { register, handleSubmit, watch, } = useForm({
		defaultValues: storedParams ? storedParams : ''
	})
	let searchItem = watch('query')

	const dispatch = useDispatch()
	const flairs = useSelector(state => state.data[WSB].flairs)
	const searchingInProgress = useSelector(state => state.meta.searching_in_progress)
	const companies = useSelector(state => state.companies)

	// Search the searchItem against the list of companies' symbols and names, and return up to the best six matches
	const filterTickers = () => {
		let matches = []
		let goodMatches = 0

		if (searchItem) {
			searchItem = searchItem.toUpperCase()
			for (const company of companies) {
				const point = company.symbol.indexOf(searchItem)
				if (point >= 0) {
					matches.push({ point: point, company: company })
					if (point === 0)
						goodMatches++
				} else if (company.name.toUpperCase().includes(searchItem)) {
					matches.push({ point: 10, company: company })
				}
				if (goodMatches >= 6)
					break
			}
		}
		matches.sort((x, y) => x.point - y.point)
		return matches.slice(0, 6)
	}

	const onSubmit = input => {
		localStorage.setItem(KEY, JSON.stringify(input))
		let subredditsToFetch = []
		for (let i = 0; i < SUBREDDITS.length; i++) {
			if (input.subreddits[i]) {
				subredditsToFetch.push(SUBREDDITS[i])
				const flair = SUBREDDITS[i] === WSB
					? input.flair
					: null
				dispatch(fetchData(SUBREDDITS[i], input.pages, input.query, flair, input.sort, input.time, input.display_post))
			}
		}

		if (subredditsToFetch.length === 0) {
			setError(true)
			return
		} else {
			setError(false)
		}

		dispatch(updateFilter(subredditsToFetch, input.show_notext_threads))
		dispatch(setSearchingInProgress())
	}

	return (
		<div className="search-form-div">
			<form className="flex-container" onSubmit={handleSubmit(onSubmit)}>
				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Query</label>

						<input
							className="search-item-input input-styles"
							list="companies"
							type="text"
							placeholder="Search... (optional)"
							title="Can search any string, do not need to be a ticker"
							autoComplete="off"
							name="query"
							ref={register()}
						/>

						<datalist id="companies">
							{filterTickers().map(match => {
								return(
									<option key={match.company.symbol} value={match.company.symbol}>
										{match.company.name}
									</option>
								)})
							}
						</datalist>
					</div>

					<div className="flex-container search-form-section">
						<label className="checkboxes-section-label">Subreddits</label>

						<div className="vertical-flex-container">
							{SUBREDDITS.map((subreddit, index) => (
								<div className="flex-container" key={index}>
									<input
										type="checkbox"
										name={`subreddits[${index}]`}
										ref={register()}
									/>
									<label className="checkbox-label">{SUBREDDITS[index]}</label>
								</div>
							))
							}
						</div>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Flair</label>

						<select
							className="input-styles"
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

					{error && <div className="red-text">Choose at least one subrredit.</div>}

					<button
						className="search-button"
						type="submit"
						disabled={searchingInProgress}
					>
						Search
					</button>

					{searchingInProgress &&
					<span className="search-in-progress red-text">
						Searching in progress...
					</span>
					}
				</div>
				<div className="form-column">
					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Sort</label>

						<select
							className="input-styles"
							title="Only applicable if ticker is not empty or flair is not 'All'"
							name="sort"
							ref={register()}
						>
							<option value="new">New</option>
							<option value="relevance">Relevance</option>
							<option value="top">Top</option>
						</select>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Time</label>

						<select
							className="input-styles"
							title="Only applicable if ticker is not empty or flair is not 'All'"
							defaultValue="week"
							name="time"
							ref={register()}
						>
							<option value="hour">Past hour</option>
							<option value="day">Past 24 hours</option>
							<option value="week">Past week</option>
							<option value="month">Past month</option>
							<option value="year">Past year</option>
							<option value="all">All time</option>
						</select>
					</div>

					<div className="flex-container search-form-section">
						<label className="search-form-section-label">Fetched datasize</label>

						<select
							className="input-styles"
							title="The maximum amount of threads to be fetched from each subreddit"
							name="pages"
							ref={register()}
						>
							<option title="100 entries" value="1">Small (recommended)</option>
							<option title="200 entries" value="2">Medium</option>
							<option title="300 entries" value="3">Large</option>
						</select>
					</div>

					<div className="flex-container search-form-section">
						<label className="checkboxes-section-label">Display</label>

						<div className="vertical-flex-container">
							<div className="flex-container">
								<input
									type="checkbox"
									title="If chosen, threads' content will be shown by default"
									name="display_post"
									ref={register()}
								/>
								<label  className="checkbox-label">Show Post Content</label>
							</div>

							<div  className="flex-container">
								<input
									type="checkbox"
									title="If chosen, threads with no text will not be filtered out"
									name="show_notext_threads"
									ref={register()}
								/>
								<label  className="checkbox-label">Show no-text Threads</label>
							</div>
						</div>
					</div>
				</div>

				<SearchRecommendation/>
			</form>

		</div>
	)
}

export default SearchForm