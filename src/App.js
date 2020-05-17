import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchData } from './reducers/dataReducer'
import SearchForm from './components/SearchForm'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchData('wallstreetbets', 1))
	}, [dispatch])

	return (
		<div className="App">
			<SearchForm/>
		</div>
	)
}

export default App
