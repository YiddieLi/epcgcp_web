import * as d3 from 'd3'

let knowledgeGraphConfig = {
    gravitation: 0.01,
    repulsion: -120,
    nodeSize: 30,
    linkWidth: 2,
    linkType: 'slink',
    nodeScale: 1,
    linkScale: 1
};

let nodes = null,
    links = null,
    containerSvg = null,
    graphSvg = null,
    simulation = null,
    nodeElements = null,
    linkElements = null,
    linkTextElements = null,
    colors = d3.scaleOrdinal(d3.schemeCategory10),
    dragNodes = null,
    relatedLinks = null,
    relatedTexts = null;

function selectLink(link) {
    link['selected'] = true;
}

function dragStart() {
    d3.event.sourceEvent.stopPropagation();
    dragNodes = nodeElements.filter(function (d) {
        return d.selected;
    });
    relatedLinks = linkElements.filter(link => {
        let check = false;
        dragNodes.each(node => {
            if (node.id === link.source.id || node.id === link.target.id) {
                check = true;
            }
        });
        return check;
    });
    relatedTexts = linkTextElements.filter(link => {
        let check = false;
        dragNodes.each(node => {
            if (node.id === link.source.id || node.id === link.target.id) {
                check = true;
            }
        });
        return check;
    });
    lowLight(nodeElements, dragNodes);
    lowLight(linkElements, relatedLinks);
}

function lowLight(selection_all, selection_part) {
    selection_all.style("opacity", 0.2);
    selection_part.style("opacity", 1);
}

function dragging() {
    dragNodes.attr("transform", node => {
        node.x += d3.event.dx;
        node.y += d3.event.dy;
        return "translate(" + node.x + "," + node.y + ")";
    });
    relatedLinks.select("path").attr("d", function (link) {
        return getLinkPath(link, knowledgeGraphConfig.linkType);
    });
    relatedTexts.attr("dx", function (link) {
        return getLinkTextDx(link);
    }).attr("transform", link => getLinkTextRotate(link));
}

function dragEnd(node) {
    // d3.select(this).classed('selected', false);
    node.selected = false;
    nodeElements.style("opacity", 1);
    linkElements.style("opacity", 1);
}

function tick() {
    nodeElements.attr('transform', node => 'translate(' + node.x + ',' + node.y + ')');
    linkElements.select('path').attr('d', link => getLinkPath(link, knowledgeGraphConfig.linkType));

    // .attr('transform', link => 'translate(' + (link.source.x + link.target.x) / 2 + ',' + (link.source.y + link.target.y) / 2 + ')');
    linkTextElements.attr("dx", link => getLinkTextDx(link))
        .attr("transform", link => getLinkTextRotate(link));
}

function getLinkPath(link, linkType) {
    if (link.source === link.target) {
        // <path d='M70 110 C 70 140, 110 140, 110 110' stroke='black' fill='transparent'/>
        let size = typeof link.source.size === 'undefined' ? knowledgeGraphConfig.nodeSize : link.source.size;
        let sx = link.source.x + size * knowledgeGraphConfig.nodeScale / 4 * 3;
        let sy = link.source.y + size * knowledgeGraphConfig.nodeScale / 4;
        let tx = link.source.x + size * knowledgeGraphConfig.nodeScale / 4;
        let ty = link.source.y + size * knowledgeGraphConfig.nodeScale / 4 * 3;
        let cx1 = sx + 150;
        let cy1 = sy;
        let cx2 = tx;
        let cy2 = ty + 150;
        return 'M' + sx + ' ' + sy + 'C' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + tx + ' ' + ty;
    }
    let path = null;
    let sx = link.source.x;
    let sy = link.source.y;
    let tx = link.target.x;
    let ty = link.target.y;
    let dx = (tx - sx) / 8;
    let dy = (ty - sy) / 8;
    let x1 = sx + dx;
    let y1 = sy + dy;
    let x2 = sx + dx * 2;
    let y2 = sy + dy * 2;
    let x3 = sx + dx * 3;
    let y3 = sy + dy * 3;
    let x4 = sx + dx * 4;
    let y4 = sy + dy * 4;
    let x7 = sx + dx * 7;
    let y6 = sy + dy * 6;
    if (linkType === 'slink') {
        path = 'M' + sx + ',' + sy + ' L' + tx + ',' + ty;
    }
    else if (linkType === 'clink') {
        path = 'M ' + sx + ',' + sy + ' C' + x1 + ',' + y2 + ' ' + x2 + ',' + y3 + ' ' + x4 + ',' + y4 + ' S' + x7 + ',' + y6 + ' ' + tx + ',' + ty;
    }
    else if (linkType === 'hlink') {
        path = 'M ' + sx + ',' + sy + ' L' + x4 + ',' + sy + ' ' + ' L' + x4 + ',' + ty + ' L' + tx + ',' + ty;
    }
    else if (linkType === 'vlink') {
        path = 'M ' + sx + ',' + sy + ' L' + sx + ',' + y4 + ' ' + ' L' + tx + ',' + y4 + ' L' + tx + ',' + ty;
    }
    return path;
}

function getLinkTextDx(link) {
    let sx = link.source.x;
    let sy = link.source.y;
    let tx = link.target.x;
    let ty = link.target.y;
    let distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
    return distance / 2;
}

function getLinkTextRotate(link) {
    let transform = '';
    if (link.source.x > link.target.x) {
        transform = 'rotate(180, ' + (link.source.x + link.target.x) / 2 + ' ' + (link.source.y + link.target.y) / 2 + ')';
    }
    return transform;
}

function textBreaking(d3text, text) {
    let showText = null;
    text = text.toString();
    if (text.length < 4) {
        showText = text;
    } else {
        showText = text.substring(0, 4) + '…'
    }
    d3text.append("tspan")
        .attr("x", 0)
        .attr("y", 2)
        .text(showText);
}

function showNodeText(key) {
    //节点文字
    if (!key) key = 'name';
    nodeElements.selectAll("text").remove();
    nodeElements.append("text")
        .attr("class", "node-text")
        .attr("dy", ".30em")
        .attr("x", function (node) {
            return textBreaking(d3.select(this), node[key]);
        });
}

function updateLabelsBar(data) {
    let labelBarUl = d3.select('#labels-bar').select('ul');
    labelBarUl.selectAll('*').remove();
    let excludeAttr = ['x', 'y', 'vx', 'vy', 'dx', 'dy', 'selected', 'color', 'size', 'index', 'properties', 'labels'];
    data.forEach(node => {
        for (let attr in node) {
            if (node.hasOwnProperty(attr) && excludeAttr.indexOf(attr) === -1) {
                labelBarUl.append("li")
                    .attr('class', 'labels')
                    .attr("id", "id-" + attr)
                    .text(attr);
                excludeAttr.push(attr);
            }
        }
    });
    d3.select("#id-name").classed("selected-labels", true);

    d3.selectAll(".labels")
        .on("click", function () {
            d3.selectAll(".selected-labels")
                .classed("selected-labels", false);
            d3.select(this)
                .classed("selected-labels", true);
            showNodeText($(this)[0].textContent);
        })
}

function drawKnowledgeGraph(containerSvgId, graphId, data, afterClickNode) {
    console.log('enter');
    nodes = data.nodes;
    links = data.links;
    containerSvg = d3.select(containerSvgId);
    graphSvg = d3.select(graphId);
    graphSvg.selectAll('*').remove();

    let linkForce = d3.forceLink().id((link) => {
        return link.id
    }).strength(knowledgeGraphConfig.gravitation);

    simulation = d3.forceSimulation().force('link', linkForce).on('end', () => {
        simulation.stop()
    });
    let containerDiv = $(containerSvgId);
    let width = containerDiv[0].clientWidth;
    let height = containerDiv[0].clientHeight;
    simulation.alphaDecay(0.002)
        .alphaMin(0.002)
        .force('r', null)
        .force('charge', d3.forceManyBody().strength(knowledgeGraphConfig.repulsion))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(knowledgeGraphConfig.nodeSize));

    simulation.restart();
    simulation.nodes(nodes).on('tick', tick).force('link').links(links);

    //关系连线
    linkElements = graphSvg.append('g')
        .attr('class', 'link-layout')
        .selectAll('g')
        .data(links);
    linkElements.exit().remove();

    let linkElementsEnter = linkElements.enter()
        .append('g')
        .attr('class', 'link');
    linkElementsEnter.append('path')
        .attr('class', 'link-path');
    linkElementsEnter.append('marker')
        .attr('class', 'link-marker')
        .attr('markerUnits', 'userSpaceOnUse')
        .attr('viewBox', '0 -50 100 100')
        .attr('refX', 340)
        .attr('refY', 0)
        .attr('markerWidth', 12)
        .attr('markerHeight', 12)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M20,0 L0,-30 L90,0 L0,30 L20,0')
        .style('fill', '#01a0f1');

    linkElements = linkElementsEnter.merge(linkElements);
    linkElements.selectAll('marker')
        .attr('id', link => 'marker-' + link.index);
    linkElements.selectAll('path')
        .attr('id', link => 'link-' + link.index)
        .attr('marker-end', link => 'url(#marker-' + link.index + ')')
        .style('stroke-width', function (link) {
            if (!('width' in link)) {
                link['width'] = knowledgeGraphConfig.linkWidth;
            }
            return link.width;
        })
        .on('mousedown.select-link', selectLink);

    //关系文字
    linkTextElements = graphSvg.append('g')
        .attr('class', 'text-layout')
        .selectAll('text')
        .data(links);
    linkTextElements.exit().remove();

    let linkTextElementsEnter = linkTextElements.enter()
        .append('text')
        .attr('class', 'link-text')
        .attr('dx', 0)
        .attr('dy', 0);
    linkTextElementsEnter.append('textPath');

    linkTextElements = linkTextElementsEnter.merge(linkTextElements);
    linkTextElements.select('textPath')
        .text(link => link.relation);

    //节点
    nodeElements = graphSvg.append('g')
        .attr('class', 'node-layout')
        .selectAll('.node')
        .data(nodes);
    nodeElements.exit().remove();

    let nodeElementsEnter = nodeElements.enter()
        .append('g')
        .attr('class', 'node')
        .on('mousedown.select-node', function (node) {
            d3.selectAll(".selected").classed("selected", false);
            d3.select(this).classed('selected', true);
            node['selected'] = true;
            simulation.stop();
            if (afterClickNode) afterClickNode(node);
        })
        .call(d3.drag().on('start', dragStart).on('drag', dragging).on('end', dragEnd));
    nodeElementsEnter.append('circle')
        .attr('r', (node) => {
            if (!('size' in node)) {
                node['size'] = knowledgeGraphConfig.nodeSize;
            }
            return node.size * knowledgeGraphConfig.nodeScale;
        }).lower();

    nodeElements = nodeElementsEnter.merge(nodeElements);
    nodeElements.select('circle').attr('fill', (node) => {
        if ('color' in node) {
            return node.color;
        } else {
            node['color'] = colors(Math.floor(Math.random() * 10));
            return node.color;
        }
    });

    showNodeText();

    updateLabelsBar(nodes);

    //滚轮缩放
    let zoom = d3.zoom()
        .on("zoom", function () {
            let translateScaleRotate = getTranslateAndScaleAndRotate(graphId);
            d3.event.transform["rotate"] = translateScaleRotate.rotate;
            zoomFunction(d3.event.transform);
        });

    containerSvg.call(zoom).on('dblclick.zoom', null);
}

function zoomFunction(vars) {
    let translate = "translate(" + vars.x + "," + vars.y + ") ";
    let scale = "scale(" + vars.k + ") ";
    let rotate = "rotate(0)";
    if (typeof(vars.rotate) === "number") {
        rotate = "rotate(" + vars.rotate + "," + (window.innerWidth / 2) + " " + (window.innerHeight / 2) + ")";
    } else {
        rotate = "rotate(" + vars.rotate.split(",")[0] + "," + (window.innerWidth / 2) + " " + (window.innerHeight / 2) + ")";
    }
    graphSvg.attr("transform", translate + scale + rotate);
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

export {drawKnowledgeGraph}
