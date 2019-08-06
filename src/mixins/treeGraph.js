import * as d3 from 'd3'

let nodes = null,
    links = null,
    containerSvg = null,
    treeSvg = null,
    marge = null,
    g = null,
    hierarchyData = null,
    tree = null,
    gLink = null,
    gNode = null,
    diagonal = null,
    width = null,
    height = null;

function drawTreeGraph(containerSvgId, treeSvgId, data) {
    containerSvg = d3.select(containerSvgId);
    treeSvg = d3.select(treeSvgId);
    treeSvg.selectAll('*').remove();
    let containerDiv = $(containerSvgId);
    width = containerDiv[0].clientWidth;
    height = containerDiv[0].clientHeight;
    marge = {top: 100, bottom: 0, left: 0, right: 0};
    g = treeSvg.append("g").attr("transform", "translate(" + marge.top + "," + marge.left + ")");
    hierarchyData = d3.hierarchy(data).sum(function (d) {
        return d.value;
    });
    hierarchyData.x0 = 0;
    hierarchyData.y0 = 0;

    hierarchyData.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        if (d.depth) d.children = null;
    });

    tree = d3.tree().size([height - 100, width - 200]).separation(function (a, b) {
        return (a.parent === b.parent ? 1 : 2) / a.depth;
    });

    diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

    gLink = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    gNode = g.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    update(hierarchyData);

    let zoom = d3.zoom()
        .on("zoom", function () {
            let translateScaleRotate = getTranslateAndScaleAndRotate(treeSvgId);
            d3.event.transform["rotate"] = translateScaleRotate.rotate;
            zoomFunction(d3.event.transform);
        });

    containerSvg.call(zoom).on('dblclick.zoom', null);
}

function update(source) {
    let duration = d3.event && d3.event.altKey ? 2500 : 250;
    nodes = hierarchyData.descendants().reverse();
    links = hierarchyData.links();
    tree(hierarchyData);

    let left = hierarchyData;
    let right = hierarchyData;
    hierarchyData.eachBefore(node => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
    });

    const transition = g.transition()
        .duration(duration)
        .attr("viewBox", [-marge.left, left.x - marge.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => treeSvg.dispatch("toggle"));

    //绘制连线
    let link = gLink.selectAll("path")
        .data(links, d => d.target.id);
    let linkEnter = link.enter()
        .append("path")
        .attr("d", () => {
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);
    link.exit().transition(transition).remove()
        .attr("d", () => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        });
    //绘制节点
    let node = gNode.selectAll("g")
        .data(nodes, d => d.id);
    let nodeEnter = node.enter()
        .append("g")
        .attr("transform", () => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
            d.children = d.children ? null : d._children;
            update(d);
        });
    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);
    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");
    node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);
    node.exit().transition(transition).remove()
        .attr("transform", () => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    hierarchyData.eachBefore(d => {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function zoomFunction(vars) {
    let translate = "translate(" + vars.x + "," + vars.y + ") ";
    let scale = "scale(" + vars.k + ") ";
    let rotate = "rotate(0)";
    if (typeof (vars.rotate) === "number") {
        rotate = "rotate(" + vars.rotate + "," + (window.innerWidth / 2) + " " + (window.innerHeight / 2) + ")";
    } else {
        rotate = "rotate(" + vars.rotate.split(",")[0] + "," + (window.innerWidth / 2) + " " + (window.innerHeight / 2) + ")";
    }
    treeSvg.attr("transform", translate + scale + rotate);
}

function getTranslateAndScaleAndRotate(element) {
    let transform = d3.select(element).attr("transform");
    let matchTranslateScale = transform && /translate/.test(transform) && /scale/.test(transform) && transform.match(/translate([^]+)\s?scale([^]+)/);
    let translate = matchTranslateScale && matchTranslateScale[1].split(",") || [0, 0];
    let k = matchTranslateScale && matchTranslateScale[2] || 1;
    let matchRotate = transform && /rotate/.test(transform) && transform.match(/\s?rotate\(([^)]+)/);
    let rotate = matchRotate && matchRotate[1] || 0;
    let x = translate[0];
    let y = translate[1];
    return {"x": x, "y": y, "k": k, "rotate": rotate};
}

export {drawTreeGraph};