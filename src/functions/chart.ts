import * as d3 from 'd3'

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const data = {
    "nodes": [{
        "id": "A",
    },
        {
            "id": "B",
        },
        {
            "id": "C",
        },
        {
            "id": "D",
        },
        {
            "id": "E",
        },
        {
            "id": "F",
        },
        {
            "id": "G",
        },],
    "links": [{
        "source": "A",
        "target": "B"
    },
        {
            "source": "B",
            "target": "D"
        },
        {
            "source": "C",
            "target": "F"
        },
        {
            "source": "D",
            "target": "A"
        },
        {
            "source": "E",
            "target": "B"
        },
        {
            "source": "F",
            "target": "A"
        },
        {
            "source": "F",
            "target": "G"
        },]
}

const zoom = d3.zoom()
    .on("zoom", function(event) {
        g.attr("transform", event.transform)
    })

const g = svg.append("g")
svg.call(zoom)

////////////////////////
// outer force layout
const simulation = d3.forceSimulation()
    .force("size", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody().strength(-5000))
    .force("link", d3.forceLink().id(function (d) {
        return d.id
    }).distance(10))

const linksContainer = g.append("g").attr("class", "linkscontainer")
const nodesContainer = g.append("g").attr("class", "nodesContainer")

const links = linksContainer.selectAll(".linkPath")
    .data(data.links)
    .enter()
    .append("path")
    .attr("class", "linkPath")
    .attr("stroke", "whitesmoke")
    .attr("fill", "transparent")
    .attr("stroke-width", 1.5)


const nodes = nodesContainer.selectAll(".nodes")
    .data(data.nodes, function (d) {
        return d.id;
    })
    .enter()
    .append("g")
    .attr("class", "nodes")
    .call(d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    )
    .on("click", function(event, d) {
        //event.stopPropagation();
        svg.transition().duration(700).call(
            zoom.transform,
            d3.zoomIdentity.translate((width / 2), (height / 2)).scale(1.2).translate(-d.x, -d.y),
            d3.pointer(event)
        );
    })

nodes.selectAll("circle")
    .data(d => [d])
    .enter()
    .append("circle")
    .attr("class", "circle")
    .style("stroke", "whitesmoke")
    .style("fill", "#76c893")
    .style("cursor", "pointer")
    .attr("r", 20)

simulation
    .nodes(data.nodes)
    .on("tick", tick)

simulation
    .force("link")
    .links(data.links)

function tick() {
    links.attr("d", function (d) {
        const dx = (d.target.x - d.source.x),
            dy = (d.target.y - d.source.y),
            dr = Math.sqrt(dx * dx + dy * dy)

        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    })

    nodes
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
}

function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}
