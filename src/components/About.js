import React from 'react'

const About = () =>
	<div>
		<h4>Motivation</h4>
		<p>Allows user to browse Reddit and reference stock&apos;s and option&apos;s quotes all in one tab.</p>

		<h4>Quick Guide</h4>
		<p><i>Search Reddit tab:</i> Allows user to fetch posts from selected subreddits (/r/WallStreetBets, /r/Investing...) and scans for stock tickers and option positions mentioned in each post and its comment. With just one click, user can have a quick glance at the stock quote or option quote without having to open another tab.</p>
		<p><i>Search Stock tab:</i> Allows user to look up a stock&apos;s quote and its option chains.</p>

		<h4>Notes</h4>
		<p>I use TD Ameritrade API for option data. The IV for an option provided by the API is calculated by the lastest option price and stock price, but because option price is not updated outside trading hours while stock price is, IVs might seem out of place when looking at options outside trading hours.</p>
		<p>I also use TD Ameritrade API for chart prices. Unfortunately, the API doesn&apos;t offer chart prices of the current trading day, so the graph for one day period is actually from the previous trading day.</p>
	</div>

export default About