import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = yearsWithItemsAndCountData;

const container = document.querySelector("#d3canvas-bar-chart");

// Set dimensions and margins of the chart
const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = container.clientWidth - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const barPadding = 0.2;  // Padding between bars

// Append the SVG object to the div with id "d3canvas"
const svg = d3.select("#d3canvas-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add zoom functionality
const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoom);

function zoomed(event) {
    const newX = event.transform.rescaleX(x);
    const newY = event.transform.rescaleY(y);

    xAxisGroup.call(xAxis.scale(newX));
    yAxisGroup.call(yAxis.scale(newY));

    barsGroup.selectAll(".bar")
        .attr("x", d => newX(d.year) + barPadding * (newX(2) - newX(1)) / 2)
        .attr("y", d => newY(d.count))
        .attr("width", (newX(2) - newX(1)) * (1 - barPadding))
        .attr("height", d => height - newY(d.count));
}

// Create a tooltip div that is hidden by default
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// X scale and axis
const x = d3.scaleLinear()
    .domain(rangeOfYears)
    .range([0, width]);

const xAxis = d3.axisBottom(x)
    .tickValues(d3.range(rangeOfYears[0], rangeOfYears[1] + 1, 10));

// Y scale and axis
const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([height, 0]);

const yAxis = d3.axisLeft(y);

// Add X axis
const xAxisGroup = svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis)
    .selectAll("text")
    .attr("class", "axis-label");

// Add Y axis
const yAxisGroup = svg.append("g")
    .call(yAxis)
    .selectAll("text")
    .on("mouseover", (event, d) => {
        console.log(d);
    })
    .attr("class", "axis-label");

// Add bars
const barsGroup = svg.append("g");
barsGroup.selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.year) + barPadding * width / (rangeOfYears[1] - rangeOfYears[0]) / 2)
    .attr("y", d => y(d.count))
    .attr("width", (width / (rangeOfYears[1] - rangeOfYears[0])) * (1 - barPadding))
    .attr("height", d => height - y(d.count))
    .on("mouseover", (event, d) => {
        console.log(d);
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Year: ${d.year}<br>Count: ${d.count}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });


