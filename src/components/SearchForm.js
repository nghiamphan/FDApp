import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'
import { updateFilter } from '../reducers/filterReducer'
import { subreddits, wsb } from '../utils/constants'

const SearchForm = () => {
	const { register, handleSubmit, } = useForm()

	const dispatch = useDispatch()
	const flairs = useSelector(state => state.data[wsb].flairs)

	const onSubmit = input => {
		let subredditsToFetch = []
		for (let i = 0; i < subreddits.length; i++) {
			if (input.subreddits[i]) {
				subredditsToFetch.push(subreddits[i])
				subreddits[i] === wsb
					? dispatch(fetchData(subreddits[i], 1, input.flair))
					: dispatch(fetchData(subreddits[i], 1))
			}
		}

		dispatch(updateFilter(input.ticker, subredditsToFetch, input.flair))
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>Ticker</label>
				<input
					type="text"
					name="ticker"
					ref={register()}
				/>
				<br/>
				<label>Subreddits</label>
				{subreddits.map((subreddit, index) => (
					<div key={index}>
						<input
							type="checkbox"
							name={`subreddits[${index}]`}
							ref={register()}
						/>
						<label>{subreddits[index]}</label>
					</div>
				))

				}
				<br/>
				<label>Flair</label>

				<select
					title="Only applicable to /r/wallstreetbets"
					name="flair"
					ref={register()}
				>
					<option value="All">All</option>
					{flairs.map((flair, index) => (
						<option key={index} value={flair}>{flair}</option>
					))}
				</select>
				<br/>
				<button type="submit">Search</button>
			</form>
		</div>
	)
}

export default SearchForm