import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = yearsWithItemsAndCountByTypeData;
const container = document.querySelector("#d3canvas-stacked-bar-chart");

// Set dimensions and margins of the chart
const margin = {top: 20, right: 30, bottom: 40, left: 40};
const width = container.clientWidth - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const barPadding = 0.1;  // Padding between stacked items

// Append the SVG object to the div with id "d3canvas-stacked-bar-chart"
const svg = d3.select("#d3canvas-stacked-bar-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create a tooltip div that is hidden by default
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// List of subgroups (categories)
const subgroups = ["paintings", "graphics"];

// List of groups (years)
const groups = data.map(d => d.year);

// X scale and axis
const x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.2]);

    const xAxis = d3.axisBottom(x)
    .tickValues(d3.range(rangeOfYears[0], rangeOfYears[1] + 1, 10));

// Y scale and axis
const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([height, 0]);

const yAxis = d3.axisLeft(y);

// Color scale
const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#6b486b", "#ff8c00"]);

// Stack the data
const stackedData = d3.stack()
    .keys(subgroups)
    .offset(d3.stackOffsetNone)(data);

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
    .attr("class", "axis-label");

// Add bars
const barsGroup = svg.append("g");
barsGroup.selectAll("g")
    .data(stackedData)
    .join("g")
    .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d.data.year) + barPadding * x.bandwidth() / 2)
    .attr("y", d => y(d[1]))
    .attr("height", d => y(d[0]) - y(d[1]))
    .attr("width", x.bandwidth() * (1 - barPadding))
    .on("mouseover", (event, d) => {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(`Count: ${d[1] - d[0]}`)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

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

    barsGroup.selectAll("g")
        .selectAll("rect")
        .attr("x", d => newX(d.data.year) + barPadding * newX.bandwidth() / 2)
        .attr("y", d => newY(d[1]))
        .attr("height", d => newY(d[0]) - newY(d[1]))
        .attr("width", newX.bandwidth() * (1 - barPadding));
}
