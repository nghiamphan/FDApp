import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeData } from './reducers/dataReducer'

const App = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(initializeData('wallstreetbets', 2, 'DD'))
	}, [dispatch])

	const data = useSelector(state => state.data)

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
