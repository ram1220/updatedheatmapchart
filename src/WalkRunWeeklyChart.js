import React, {
    Component
} from 'react';
import d3 from "./d3Modules";
import moment from "moment";
import stepsJson from './stepsWeekly.json';

class WalkRunWeeklyChart extends Component {

    componentDidMount() {
        // fetch('url').then((res) => {
        //     this.drawChart(res);
        // }).catch((error) => {
        //     console.log(error);
        // });
        this.drawChart(stepsJson);
    }

    drawChart(stepsJson) {
        console.log(stepsJson);
        const causes = ['run', 'walk']
        
        const margin = {
            top: 20,
            right: 50,
            bottom: 30,
            left: 50
        }
        const width = 960 - margin.left - margin.right
        const height = 500 - margin.top - margin.bottom

        const x = d3.scaleBand()
            .rangeRound([0, width])

        const y = d3.scaleLinear()
            .rangeRound([height, 0])

        const z = d3.scaleOrdinal()
            .range(["#98abc5", "#8a89a6"]);

        const xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d3.timeFormat('%m/%d'))

        const yAxis = d3.axisLeft()
            .scale(y)

        const svg = d3.select('#heat-map')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        const legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(causes)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + i * 50 + ",0)"; });
      
        legend.append("rect")
            .attr("x", (width/2) - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", (d, i) => (z(i)));
      
        legend.append("text")
            .attr("x", (width/2) - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

    
        const layers = d3.stack()
            .keys(causes)
            (stepsJson.data);

        x.domain(layers[0].map(d => new Date(d.data.date)))
        y.domain([0, d3.max(layers[layers.length - 1], d => (d[0] + d[1]))]).nice()
        z.domain(causes);

        const layer = svg.selectAll('layer')
            .data(layers)
            .enter()
            .append('g')
            .attr('class', 'layer')
            .style('fill', (d, i) => (z(i)))

        layer.selectAll('rect')
            .data(d => d)
            .enter()
            .append('rect')
            .attr('x', d => x(new Date(d.data.date)))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth() - 1)
            .on("mouseout", function() {
                tooltip.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            })
            .on("mouseover", function(d, i) {
                const thisName = d3.select(this.parentNode).datum().key;

                tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);

                tooltip.html(thisName +': '+ (d[1]-d[0]))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");

            });

        svg.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis)
            .selectAll("text")
            .attr("y", 10)
            .attr("x", 5)
            .attr("dy", ".35em")
            .attr("transform", "rotate(30)")
            .style("text-anchor", "start");

        svg.append('g')
            .attr('class', 'axis axis--y')
            .attr('transform',0, `translate(${width})`)
            .call(yAxis)


        const tooltip = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    }

    render() {
        return <div id = "heat-map" > </div>
    }
}

export default WalkRunWeeklyChart;