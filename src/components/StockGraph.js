import React, { useEffect, useState } from 'react'
import { XYPlot, LineSeries, XAxis, YAxis } from 'react-vis'
import '../../node_modules/react-vis/dist/style.css'

import { fetchPriceHistory } from '../services/stockService'
import { FAILED } from '../utils/constants'

const StockGraph = ({ ticker }) => {
	const [priceHistory, setPriceHistory] = useState([])

	useEffect(() => {
		fetchPriceHistory(ticker, 'day', 1, 1)
			.then(response => {
				if (response && response !== FAILED) {
					setPriceHistory (
						response.map(pricePoint => ({
							x: pricePoint.datetime,
							y: pricePoint.close,
						}))
					)
				}
			})
	}, [ticker])

	return (
		<XYPlot height={200} width={600}>
			<LineSeries data={priceHistory}  color="green" size="3"/>
			<XAxis/>
			<YAxis/>
		</XYPlot>
	)
}

export default StockGraph