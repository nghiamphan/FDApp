import React from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { fetchData } from '../reducers/dataReducer'

const SearchForm = () => {
	const { register, handleSubmit, } = useForm()
	const dispatch = useDispatch()

	const onSubmit = input => {
		dispatch(fetchData(input.subreddit, 1))
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
				<button type="submit">Search</button>
			</form>
		</div>
	)
}

export default SearchForm