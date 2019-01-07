import React, { Component } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import './FifaGraph.css';
import fifaFile from './FIFA19 - Ultimate Team players.csv';
import asterData from './asterdata.csv';

class FifaGraph extends Component {
  componentDidMount() {
    let width = 500,
    height = 500,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;
    let colorPalette = ['#9E0041', '#EAF195', '#E1514B', '#F47245', '#FB9F59', '#FEC574', '#FAE38C', '#EAF195']

    let pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.width; });

    let outlineArc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    let svg = d3.select(".App").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv(fifaFile)
      .then((data) => {
        let resultData = []
        let cam = data.filter((datum) =>  {
          return datum.position === 'CAM'
        });

        let strikers = data.filter((datum) =>  {
          return datum.position === 'ST'
        });

        let centerbacks = data.filter((datum) =>  {
          return datum.position === 'CB'
        });

        let gk = data.filter((datum) =>  {
          return datum.position === 'GK'
        });

        let cdm = data.filter((datum) =>  {
          return datum.position === 'CDM'
        });

        let cf = data.filter((datum) => {
          return datum.position === 'CF'
        })

        resultData.push({
          total: cam.length,
          position: 'Central Attacking Midfielder'
        }, {
          total: strikers.length,
          position: 'Striker'
        }, {
          total: centerbacks.length,
          position: 'Centerbacks'
        }, {
          total: gk.length,
          position: 'GoalKeepers'
        }, {
          total: cdm.length,
          position: 'Center Defensive Midfielder'
        }, {
          total: cf.length,
          position: 'Center Forward'
        })

        let max = d3.max(resultData, (d) => {
            return  +d.total
        })

        let arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) { 
          return (radius - innerRadius) * (d.data.total / max) + innerRadius; 
        });
    


        console.log(max)

        let tip = d3Tip()
        .attr('class', 'd3-tip')
        .offset([0, 0])
        .html(function(d) {
          return d.data.position + ": <span style='color:orangered'>" + d.data.total + "</span>";
        });

        svg.call(tip);
        resultData.forEach(function(d, index) {
          d.order  = index + 1;
          d.color  =  colorPalette[index];
          d.weight = 0.5;
          d.total  = +d.total;
          d.width  = 0.8;
          d.position  = d.position;
        });
      
        svg.selectAll(".solidArc")
          .data(pie(resultData))
          .enter().append("path")
          .attr("fill", function(d) { return d.data.color; })
          .attr("class", "solidArc")
          .attr("stroke", "gray")
          .attr("d", arc)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        svg.selectAll(".outlineArc")
          .data(pie(resultData))
          .enter().append("path")
          .attr("fill", "none")
          .attr("stroke", "gray")
          .attr("class", "outlineArc")
          .attr("d", outlineArc);  

        // let score = 
        //   data.reduce(function(a, b) {
        //     //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
        //     return a + (b.score * b.weight); 
        //   }, 0) / 
        //   data.reduce(function(a, b) { 
        //     return a + b.weight; 
        //   }, 0);

        svg.append("svg:text")
          .attr("class", "aster-score")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle") // text-align: right
        

        });
}

  render() {
    return (
      <svg className="chart">
      </svg>
    )
  }
}

function type(d) {
  d.overall = +d.overall; // coerce to number
  return d;
}

export default FifaGraph