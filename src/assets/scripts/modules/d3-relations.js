import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const container = document.querySelector("#d3canvas-relations");

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = container.clientWidth - margin.left - margin.right;
const height = container.clientHeight - margin.top - margin.bottom;

const handleZoom = event => {
    const transform = event.transform;
    const svg = d3.select("#d3canvas-relations").select("svg");
    svg.attr("transform", transform);
}

const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', handleZoom);

const svg = d3.select("#d3canvas-relations")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height)
    .call(zoom);   

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .attr("fill", d => color(d.group))
    .on("click", (event, d) => {
        const url = `https://lucascranach.org/de/${d.id}`;
        window.open(url, '_blank');
    })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append("title")
    .text(d => `${d.id} | ${d.group}`);

const image = svg.append("g")
    .attr("class", "images")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("svg:image")
    .data(graph.nodes)
    .attr("xlink:href", d => d.img.replace(/lucascranach.org\/imageserver-2022/, "lucascranach.org/data-proxy/image.php?subpath="))
    .attr("x", -8)
    .attr("y", -8)
    .attr("width", 16)
    .attr("height", 16);

simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

simulation.force("link")
    .links(graph.links);

function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

        node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
        image
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);        
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}