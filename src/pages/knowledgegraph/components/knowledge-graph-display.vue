<template>
    <div class="knowledge-graph-display">
        <svg class="svg-area" id="svg"></svg>
    </div>
</template>

<script>
    import * as d3 from "d3"
    import svgCoordinate from '../../../mixins/svgCoordinate.js'

    export default {
        name: "knowledge-graph-display",
        mixins: [svgCoordinate],
        data() {
            return {
                knowledgeGraphData: []
            }
        },
        methods: {
            setKnowledgeGraphData(data) {
                let self = this;
                if (data) self.knowledgeGraphData = JSON.parse(JSON.stringify(data));

                let nodes = [{
                    label: '节点1',
                    id: 1,
                    level: 1
                }, {
                    label: '节点2',
                    id: 2,
                    level: 2
                }, {
                    label: '节点3',
                    id: 3,
                    level: 2
                }];

                let links = [{
                    source: 1,
                    target: 2,
                    relation: '关系1'
                }, {
                    source: 1,
                    target: 3,
                    relation: '关系2'
                }];

                let displayDiv = $('#svg');
                let width = displayDiv[0].clientWidth;
                let height = displayDiv[0].clientHeight;
                let svg = d3.select('svg')
                    .attr('width', `${width}`)
                    .attr('height', `${height}`);
                svg.selectAll("*").remove();

                let markerHeight = 12,
                    markerWidth = 12,
                    nodeRadius = 40,
                    refX = 44,
                    refY = 0,
                    drSub = nodeRadius + refY;

                let linkForce = d3.forceLink()
                    .id(function (link) {
                        return link.id
                    }).strength(0.01);

                let simulation = d3.forceSimulation()
                    .nodes(nodes)
                    .force('link', linkForce)
                    .force('charge', d3.forceManyBody().strength(-120))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                let marker = svg.append("marker")
                    .attr("id", "resolved")
                    .attr("markerUnits", "userSpaceOnUse")
                    .attr("viewBox", "0 -5 10 10")//坐标系的区域
                    .attr("refX", refX)//箭头坐标
                    .attr("refY", refY)
                    .attr("markerWidth", markerWidth)//标识的大小
                    .attr("markerHeight", markerHeight)
                    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .attr("stroke-width", 1)//箭头宽度
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill', '#000000');//箭头颜色

                let dragDrop = d3.drag().on('start', (node) => {
                    node.fx = node.x;
                    node.fy = node.y
                }).on('drag', (node) => {
                    simulation.alphaTarget(0.7).restart();
                    node.fx = d3.event.x;
                    node.fy = d3.event.y;
                }).on('end', (node) => {
                    if (!d3.event.active) {
                        simulation.alphaTarget(0);
                    }
                    node.fx = null;
                    node.fy = null;
                });

                let linkElements = svg.append('g')
                    .attr('class', 'links')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line')
                    .attr('marker-end', 'url(#resolved)');

                let linkTextElements = svg.append('g')
                    .selectAll('.relation')
                    .data(links)
                    .enter()
                    .append('text')
                    .text(function (link) {
                        return link.relation
                    })
                    .attr('class', 'line-text')
                    .attr('dx', 0)
                    .attr('dy', 0);

                let nodeElements = svg.append('g')
                    .selectAll('circle')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('class', 'nodes')
                    .attr('r', nodeRadius)
                    .attr('fill', function (node) {
                        return node.level === 1 ? '#408080' : '#01a0f1';
                    })
                    .call(dragDrop);

                let nodeTextElements = svg.append('g')
                    .selectAll('text')
                    .data(nodes)
                    .enter()
                    .append('text')
                    .text(function (node) {
                        return node.label
                    })
                    .attr('class', 'node-text')
                    .attr('text-anchor', 'middle')
                    .attr('x', 0)
                    .attr('y', 6);

                simulation.on('tick', () => {
                    nodeElements.attr('transform', (node) => {
                        return "translate(" + node.x + "," + node.y + ")";
                    });
                    nodeTextElements.attr('transform', (node) => {
                        return "translate(" + node.x + "," + node.y + ")"
                    });
                    linkElements.attr('d', (link) => {
                        let dx = link.target.x - link.source.x,
                            dy = (link.target.y - link.source.y),
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + link.source.x + "," + link.source.y + "A" + (dr - drSub) + "," + (dr - drSub) + " 0 0,1 " + link.target.x + "," + link.target.y;
                    }).attr('x1', function (link) {
                        return link.source.x;
                    }).attr('y1', function (link) {
                        return link.source.y;
                    }).attr('x2', function (link) {
                        return link.target.x;
                    }).attr('y2', function (link) {
                        return link.target.y;
                    });
                    linkTextElements.attr('transform', (link) => {
                        return "translate(" + (link.source.x + link.target.x) / 2 + "," + (link.source.y + link.target.y) / 2 + ")"
                    });
                });

                simulation.force('link').links(links);
            }
        }
    }
</script>

<style lang="less">
    @import "../../../css/global.less";

    .knowledge-graph-display {
        height: 100%;
        width: 100%;
        padding: 20px 10px;
        box-sizing: border-box;
        .svg-area {
            height: 100%;
            width: 100%;
            .nodes {
                cursor: default;
            }
            .links line {
                stroke: @darkGreyColor;
                stroke-opacity: 1;
                stroke-width: 2;
            }
            .node-text {
                cursor: default;
            }
            .line-text {
                font-size: 11px;
            }
        }
    }
</style>
