import * as d3 from 'd3'

export default {
    data() {
        return {
            knowledgeGraphConfig: {
                gravitation: 0.02,
                repulsion: -300,
                nodeSize: 30,
                linkWidth: 2,
                linkType: 'slink',
                nodeScale: 1,
                linkScale: 1
            },
            nodeElements: null,
            linkElements: null,
            linkTextElements: null,
            dragNodes: [],
            relatedLinks: [],
            relatedTexts: [],
            colors: d3.scaleOrdinal(d3.schemeCategory10)
        }
    },
    methods: {
        drawKnowledgeGraph(svg, data, width, height) {
            console.log('enter');
            let self = this;
            let nodes = data.nodes;
            let links = data.links;
            svg.attr('width', width).attr('height', height);

            let linkForce = d3.forceLink().id((link) => {
                return link.id
            }).strength(self.knowledgeGraphConfig.gravitation);
            let simulation = d3.forceSimulation().force('link', linkForce).on('end', () => {
                simulation.stop()
            });

            simulation.alphaDecay(0.002)
                .alphaMin(0.002)
                .force('r', null)
                .force('charge', d3.forceManyBody().strength(self.knowledgeGraphConfig.repulsion))
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force('collision', d3.forceCollide(self.knowledgeGraphConfig.nodeSize));

            simulation.nodes(nodes).on('tick', self.tick).force('link').links(links);

            self.linkElements = svg.append('g')
                .attr('class', 'link-layout')
                .selectAll('g')
                .data(links);
            self.linkElements.exit().remove();

            let linkElementsEnter = self.linkElements.enter()
                .append('g')
                .attr('class', 'link');
            linkElementsEnter.append('path')
                .attr('class', 'link-path');
            linkElementsEnter.append('marker')
                .attr('class', 'link-marker')
                .attr('markerUnits', 'userSpaceOnUse')
                .attr('viewBox', '0 -50 100 100')
                .attr('refX', 400)
                .attr('refY', 0)
                .attr('markerWidth', 12)
                .attr('markerHeight', 12)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M20,0 L0,-30 L90,0 L0,30 L20,0')
                .style('fill', '#00FFFB');

            self.linkElements = linkElementsEnter.merge(self.linkElements);
            self.linkElements.selectAll('marker')
                .attr('id', link => 'marker-' + link.index);
            self.linkElements.selectAll('path')
                .attr('id', link => 'link-' + link.index)
                .attr('marker-end', link => 'url(#marker-' + link.index + ')')
                .style('stroke-width', function (link) {
                    if (!('width' in link)) {
                        link['width'] = self.knowledgeGraphConfig.linkWidth;
                    }
                    return link.width;
                })
                .on('mousedown.select-link', self.selectLink)
                .on('mouseover.hover-link', self.hoverLink);

            self.linkTextElements = svg.append('g')
                .attr('class', 'text-layout')
                .selectAll('text')
                .data(links);
            self.linkTextElements.exit().remove();

            let linkTextElementsEnter = self.linkTextElements.enter()
                .append('text')
                .attr('class', 'link-text')
                .style('font-size', 10)
                .append('textPath');

            self.linkTextElements = linkTextElementsEnter.merge(self.linkTextElements);
            self.linkTextElements.select('textPath')
                .attr('xlink:href', link => '#link-' + link.index)
                .text(link => link.relation);

            self.nodeElements = svg.append('g')
                .attr('class', 'node-layout')
                .selectAll('.node')
                .data(nodes);
            self.nodeElements.exit().remove();

            let nodeElementsEnter = self.nodeElements.enter()
                .append('g')
                .attr('class', 'node')
                .on('mousedown.select-node', self.selectNode)
                .on('mousedown.hover-node', self.hoverNode)
                .call(d3.drag().on('start', self.dragStart).on('drag', self.dragging).on('end', self.dragEnd))
                .append('circle')
                .attr('r', (node) => {
                    if (!('size' in node)) {
                        node['size'] = self.knowledgeGraphConfig.nodeSize;
                    }
                    return node.size * self.knowledgeGraphConfig.nodeScale;
                }).lower();

            self.nodeElements = nodeElementsEnter.merge(self.nodeElements);
            self.nodeElements.attr('fill', (node) => {
                if ('color' in node) {
                    return node.color;
                } else {
                    node['color'] = self.colors(Math.floor(Math.random() * 10));
                    return node.color;
                }
            }).attr('stroke', 'white');
        },
        tick() {
            let self = this;
            self.nodeElements.attr('transform', node => 'translate(' + node.x + ',' + node.y + ')');
            self.linkElements.select('path').attr('d', link => self.getLinkPath(link, self.knowledgeGraphConfig.linkType));
            self.linkTextElements.attr('dx', link => self.getLinkTextDx(link))
                .attr('transform', link => self.getLinkTextRotate(link));
        },
        getLinkPath(link, linkType) {
            let self = this;
            if (link.source === link.target) {
                // <path d='M70 110 C 70 140, 110 140, 110 110' stroke='black' fill='transparent'/>
                let size = typeof link.source.size === 'undefined' ? self.knowledgeGraphConfig.nodeSize : link.source.size;
                let sx = link.source.x + size * self.knowledgeGraphConfig.nodeScale / 4 * 3;
                let sy = link.source.y + size * self.knowledgeGraphConfig.nodeScale / 4;
                let tx = link.source.x + size * self.knowledgeGraphConfig.nodeScale / 4;
                let ty = link.source.y + size * self.knowledgeGraphConfig.nodeScale / 4 * 3;
                let cx1 = sx + 150;
                let cy1 = sy;
                let cx2 = tx;
                let cy2 = ty + 150;
                return 'M' + sx + ' ' + sy + 'C' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + tx + ' ' + ty;
            }
            let path = null;
            let temp = 0;
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
        },
        getLinkTextDx(link) {
            let sx = link.source.x;
            let sy = link.source.y;
            let tx = link.target.x;
            let ty = link.target.y;
            let distance = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
            return distance / 2;
        },
        getLinkTextRotate(link) {
            let transform = '';
            if (link.source.x > link.target.x) {
                transform = 'rotate(180, ' + (link.source.x + link.target.x) / 2 + ' ' + (link.source.y + link.target.y) / 2 + ')';
            }
            return transform;
        },
        selectLink(link) {
            link['selected'] = true;
            // d3.select(this).classed('selected', true);
        },
        hoverLink(link) {

        },
        selectNode(node) {
            // d3.select(this).classed("finded", false);
            node['selected'] = true;
            // d3.select(this).classed("selected", true);
        },
        hoverNode(node) {

        },
        dragStart(node) {
            let self = this;
            d3.event.sourceEvent.stopPropagation();
            self.dragNodes = self.nodeElements.filter(function (d) {
                return d.selected;
            });
            self.relatedLinks = self.linkElements.filter(link => {
                let check = false;
                self.dragNodes.each(node => {
                    if (node.id === link.source.id || node.id === link.target.id) {
                        check = true;
                    }
                });
                return check;
            });
            self.relatedTexts = self.linkTextElements.filter(link => {
                let check = false;
                self.dragNodes.each(node => {
                    if (node.id === link.source.id || node.id === link.target.id) {
                        check = true;
                    }
                });
                return check;
            });
            self.lowLight(self.nodeElements, self.dragNodes);
            self.lowLight(self.linkElements, self.relatedLinks);
        },
        lowLight(selection_all, selection_part) {
            selection_all.style("opacity", 0.2);
            selection_part.style("opacity", 1);
        },
        dragging(node) {
            let self = this;
            self.dragNodes.attr("transform", node => {
                node.x += d3.event.dx;
                node.y += d3.event.dy;
                return "translate(" + node.x + "," + node.y + ")";
            });
            self.relatedLinks.select("path").attr("d", function (link) {
                return self.getLinkPath(link, self.knowledgeGraphConfig.linkType);
            });
            self.relatedTexts.attr("dx", function (link) {
                return self.getLinkTextDx(link);
            }).attr("transform", link => self.getLinkTextRotate(link));
        },
        dragEnd(node) {
            let self = this;
            self.nodeElements.style("opacity", 1);
            self.linkElements.style("opacity", 1);
        }
    }
}
