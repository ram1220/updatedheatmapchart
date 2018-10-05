import React, { Component } from 'react';
import './App.css';

import { generateFakeData, generateDayViewData, generateWeekViewData } from './data/dataGenerator';

import HeatMapChart from './HeatMapChart';
import DayViewChart from './DayViewChart';
import WeeKViewChart from './WeekViewChart';

import WalkRunChart from './WalkRunChart';
import WalkRunWeeklyChart from './WalkRunWeeklyChart';

import json from './data.json';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			chartType: 'monthly',
			chartData: null
		};
		this.onClick_setActiveChart = this.onClick_setActiveChart.bind(this);
	}
  
	onClick_setActiveChart(event) {
		const chartType = event.currentTarget.getAttribute('data-chart');
		let chartData = null;
		switch(chartType) {
			case 'day':
				//chartData = json;
				chartData = generateDayViewData();
				break;
			case 'week':
				//chartData = json;
				chartData = generateWeekViewData();
				break;
			case 'monthly':
				chartData = json; //generateFakeData();
				break;
		}	
		this.setState({
			chartType,
			chartData
		});
	}

	render() {
		const {chartType, chartData} = this.state;
		return (
			<div className="App">
				<div className="chart-buttons">
					<button className={(chartType === 'monthly') ? 'active' : ''} data-chart="monthly" onClick={this.onClick_setActiveChart}>Monthly</button>
					<button className={(chartType === 'week') ? 'active' : ''} data-chart="week" onClick={this.onClick_setActiveChart}>Weekly</button>
					<button className={(chartType === 'day') ? 'active' : ''} data-chart="day" onClick={this.onClick_setActiveChart}>Day View</button>
					<button className={(chartType === 'stepdaily') ? 'active' : ''} data-chart="stepdaily" onClick={this.onClick_setActiveChart}>Steps Daily Chart</button>
					<button className={(chartType === 'stepweekly') ? 'active' : ''} data-chart="stepweekly" onClick={this.onClick_setActiveChart}>Steps Weekly Chart</button>
				</div>
				{chartType === 'monthly' && <HeatMapChart chartData={chartData} />}
				{chartType === 'week' && <WeeKViewChart chartData={chartData} />}
				{chartType === 'day' && <DayViewChart chartData={chartData} />}
				{chartType === 'stepdaily' && <WalkRunChart />}
				{chartType === 'stepweekly' && <WalkRunWeeklyChart />}    
			</div>
		);  
	}
}

export default App;
