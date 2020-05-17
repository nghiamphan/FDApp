import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'
import { updateFilter } from '../reducers/filterReducer'

const SearchForm = () => {
	const { register, handleSubmit, } = useForm()
	const dispatch = useDispatch()
	const flairs = useSelector(state => state.data['wallstreetbets'].flairs)

	const onSubmit = input => {
		dispatch(fetchData(input.subreddit, 1, input.flair))
		dispatch(updateFilter(input.ticker, input.subreddit, input.flair))
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
				<label>Subreddit</label>
				<input
					type="text"
					name="subreddit"
					ref={register({ required: true })}
				/>
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