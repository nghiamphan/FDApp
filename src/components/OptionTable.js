import React from 'react'
import { textColorStyle } from '../utils/dataFormat'

const OptionTable = ({ positions }) => (
	<div className="option-table-div">
		<table>
			<thead>
				<tr>
					<th>Strike</th>
					<th>Type</th>
					<th className="wider-table-cell">Date</th>
					<th>Last</th>
					<th className="wider-table-cell">Change</th>
					<th className="wider-table-cell">Bid</th>
					<th className="wider-table-cell">Ask</th>
					<th>Volume</th>
					<th>OI</th>
					<th>Low</th>
					<th>High</th>
					<th>Close</th>
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
						<td className="wider-table-cell">{position.date}</td>
						<td style={textColorStyle(position.percentChange)}>{position.last}</td>
						<td  className="wider-table-cell" style={textColorStyle(position.percentChange)}>{position.percentChange}%</td>
						<td className="wider-table-cell">{position.bid} x {position.bidSize}</td>
						<td className="wider-table-cell">{position.ask} x {position.askSize}</td>
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
	</div>
)

export default OptionTable