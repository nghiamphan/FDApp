import React from 'react'
import { textColorStyle } from '../utils/dataFormat'

const positionTable = ({ positions }) => (
	<table>
		<thead>
			<tr>
				<th>Strike</th>
				<th>Type</th>
				<th>Date</th>
				<th>Last</th>
				<th>Change</th>
				<th>Bid</th>
				<th>Ask</th>
				<th>Volume</th>
				<th>Open Int.</th>
				<th>Low</th>
				<th>High</th>
				<th>Prev. Close</th>
				<th>IV</th>
				<th>Delta</th>
				<th>Gamma</th>
				<th>Theta</th>
				<th>Vega</th>
				<th>Rho</th>
			</tr>
		</thead>

		<tbody>
			{positions.map((position, index) =>
				<tr key={index}>
					<td>{position.strike}</td>
					<td>{position.type}</td>
					<td>{position.date}</td>
					<td style={textColorStyle(position.percentChange)}>{position.last}</td>
					<td style={textColorStyle(position.percentChange)}>{position.percentChange}%</td>
					<td>{position.bid} x {position.bidSize}</td>
					<td>{position.ask} x {position.askSize}</td>
					<td>{position.volume}</td>
					<td>{position.openInterest}</td>
					<td>{position.low}</td>
					<td>{position.high}</td>
					<td>{position.previousClose}</td>
					<td>{position.volatility}</td>
					<td>{position.delta}</td>
					<td>{position.gamma}</td>
					<td>{position.theta}</td>
					<td>{position.vega}</td>
					<td>{position.rho}</td>
				</tr>
			)}
		</tbody>
	</table>
)

export default positionTable