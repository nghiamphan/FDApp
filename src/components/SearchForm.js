import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'
import { updateFilter } from '../reducers/filterReducer'

const SearchForm = () => {
	const { register, handleSubmit, } = useForm()
	const dispatch = useDispatch()

	const onSubmit = input => {
		dispatch(fetchData(input.subreddit, 1))
		dispatch(updateFilter(input.ticker, input.subreddit, input.flair))
	}

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label>Ticker</label>
				<input
					type="text"
					name="ticker"
					ref={register({ required: true })}
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
				<input
					type="text"
					title="Only applicable to /r/wallstreetbets"
					name="flair"
					ref={register()}
				/>
				<br/>
				<button type="submit">Search</button>
			</form>
		</div>
	)
}

export default SearchForm