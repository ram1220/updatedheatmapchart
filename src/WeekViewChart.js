import React, {
    Component
} from 'react';
import * as d3 from "d3";
import moment from "moment";


class WeeKViewChart extends Component {

    constructor(props) {
        super(props);
        this.data = null;
    }

    componentDidMount() {
        const {chartData} = this.props;
        this.processData(chartData);
    }

    processData(json) {
        const data = [],
            days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

        const jsonData = json.map(function (obj) {
            return ({
                day: moment(obj.start).day(),
                hour: moment(obj.start).hours(),
                startMin: moment(obj.start).minute(),
                endMin: moment(obj.end).minute(),
                value: obj.sleepStatus
            });
        });
        console.log(jsonData);
        
        days.forEach(function (d, di) {
            times.forEach(function (t, ti) {
                data.push({
                    day: di + 1,
                    hour: ti + 1,
                    value: 'DEFAULT'
                });
            });
        });
        this.data = data;
        this.days = days;
        this.times = times;
        console.log(data);

        this.drawChart(jsonData);
    }

    drawChart(jsonData) {
        const data = this.data;
        const days = this.days;
        const times = this.times;
        const margin = {
                top: 50,
                right: 0,
                bottom: 100,
                left: 30
            },
            width = 960 - margin.left - margin.right,
            height = 430 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize * 2,
            buckets = 9,
            colors = {
                'DEFAULT': "#ffffd9",
                'ASLEEP': "#d83131",
                'AWAKE': "#2889e2"
            };
        
        const svg = d3.select("#heat-map svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function (d, i) {
                return (6-i) * gridSize;
            })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) {
                return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis");
            });

        svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function (d) {
                return d;
            })
            .attr("x", function (d, i) {
                return i * gridSize;
            })
            .attr("y", 290)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function (d, i) {
                return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis");
            });
        
        d3.select("div.tooltip").remove();

        var div = d3.select("body").append("div")	
            .attr("class", "tooltip tooltip-heap")				
            .style("opacity", 0);
        
        const cards = svg.selectAll(".hour")
            .data(data, function (d) {
                return d.day + ':' + d.hour;
            });

        cards.enter().append("rect")
            .attr("x", function (d) {
                return (d.hour - 1) * gridSize;
            })
            .attr("y", function (d) {
                return (d.day - 1) * gridSize;
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", function (d) {
                return "hour bordered " + d.value;
            })
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", function (d) {
                return colors['DEFAULT'];
            });

        const minCards = svg.selectAll(".status")
            .data(jsonData)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return ((d.hour) * gridSize) + ((d.startMin) * gridSize/60);
            })
            .attr("y", function (d) {
                return ((gridSize * 6)) - (d.day * gridSize);
            })
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "status")
            .attr("height", gridSize-4)
            .attr("width", function (d) {
                return (d.endMin - d.startMin) * (gridSize/60);
            })
            .style("fill", function (d) {
                return colors[d.value]
            })
            .attr("transform", "translate(0,2)")
            .on("mouseover", function(d, i) {
                const diff = (d.endMin - d.startMin);
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div	.html(d.value + ': ' + diff + ' min(s)')	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
            })
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
    }

    render() {
        return (
            <React.Fragment>
                <div id = "heat-map">
                    <svg />
                </div>
            </React.Fragment>
            
        )
    }
}

export default WeeKViewChart;