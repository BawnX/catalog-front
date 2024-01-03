import * as d3 from 'd3'

const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
svg.attr("viewBox", [-width / 2, -height / 2, width, height])

const suits = [
    {
        "source": "New Exception Maintainer",
        "target": "Data Integration",
        "type": "rest"
    },
    {
        "source": "Data Integration",
        "target": "DB CORE",
        "type": "sqlCore"
    },
    {
        "source": "Data Integration",
        "target": "DB LEGACY",
        "type": "sqlLegacy"
    },
    {
        "source": "Data Integration",
        "target": "DB Data Integration",
        "type": "sqlTEO"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Generic Policy",
        "type": "graphql"
    },
    {
        "source": "Generic Policy",
        "target": "DB CORE",
        "type": "sqlCore"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Broker List",
        "type": "graphql"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Generic Person",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Product CORE",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Crypto CORE",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Insured Matter",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "PDF Policy CORE",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Generic Person",
        "type": "graphql"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Process Exception Maintainer",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Payment",
        "type": "graphql"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Renewals",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "Contractor CORE",
        "type": "rest"
    },
    {
        "source": "New Exception Maintainer",
        "target": "CORE Maintainer",
        "type": "rest"
    },
]

const types = Array.from(new Set(suits.map(d => d.type)));
const nodes = Array.from(new Set(suits.flatMap(l => [l.source, l.target])), id => ({id}));
const links = suits.map(d => Object.create(d))
const color = d3.scaleOrdinal(types, d3.schemeCategory10);

const drag = (simulation: any) => {

    function dragstarted(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event: any, d: any) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: any, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}


////////////////////////
// outer force layout
const simulation = d3.forceSimulation(nodes as any)
    .force("link", d3.forceLink(links).id((d: any) => d.id))
    .force("charge", d3.forceManyBody().strength(-800))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

svg.append("defs").selectAll("marker")
    .data(types)
    .join("marker")
    .attr("id", d => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", color)
    .attr("d", "M0,-5L10,0L0,5");
const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("stroke", d => color(d.type))
    .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location as any)})`);

const node = svg.append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .call(drag(simulation) as any);

node.append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", 6);

node.append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .text(d => d.id)
    .clone(true).lower()
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3);

function linkArc(d: any) {
    const r = Math.hypot(d.target.x - d.source.x, d.target.y - d.source.y);
    return `
    M${d.source.x},${d.source.y}
    A${r},${r} 0 0,1 ${d.target.x},${d.target.y}
  `;
}

simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
});


