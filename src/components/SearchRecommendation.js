import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { turnOffRedditSearchRecommendation } from '../reducers/metaReducer'

const SearchRecommendation = () => {
	const dispatch = useDispatch()
	const showRedditSearchRecommendation = useSelector(state => state.meta.show_reddit_search_recommendation)

	if (showRedditSearchRecommendation) {
		return (
			<div className="search-recommendation flex-container">
				<div className="search-recommendation-text">
						Search Recommendation:
					<ul>
						<div>Subreddit: <i>WallStreetBets</i></div>
						<div>Flair: <i>DD</i></div>
						<div>Sort: <i>New</i></div>
						<div>Time: <i>Past week</i></div>
					</ul>
						for the latest &ldquo;due dilligence&rdquo; from &ldquo;option experts&rdquo; of WSB.
				</div>
				<div
					className="search-recommendation-close"
					onClick={() => dispatch(turnOffRedditSearchRecommendation())}
				>
					<FontAwesomeIcon icon={faTimes}/>
				</div>
			</div>
		)
	} else {
		return null
	}
}

export default SearchRecommendation