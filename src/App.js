import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from './reducers/dataReducer'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchData('wallstreetbets', 1))
	}, [dispatch])

	const state = useSelector(state => state.data)
	const data = state['wallstreetbets']
		? state['wallstreetbets'].data
		: []

	return (
		<div className="App">
			{data.map(post => (
				<div key={post.id}>
					{post.title}
					<br/>
					Content: {post.content}<br/><br/>
				</div>
			))}
		</div>
	)
}

export default App
