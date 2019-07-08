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

                let linkForce = d3
                    .forceLink()
                    .id(function (link) {
                        return link.id
                    })
                    .strength(0.01);

                let simulation = d3.forceSimulation()
                    .force('link', linkForce)
                    .force('charge', d3.forceManyBody().strength(-120))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                let nodeElements = svg.append('g')
                    .selectAll('circle')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('r', 40)
                    .attr('fill', function (node) {
                        return node.level === 1 ? '#408080' : '#01a0f1';
                    });

                let nodeTextElements = svg.append('g')
                    .selectAll('text')
                    .data(nodes)
                    .enter()
                    .append('text')
                    .text(function (node) {
                        return node.label
                    })
                    .attr('text-anchor', 'middle')
                    .attr('font-size', 14)
                    .attr('x', 0)
                    .attr('y', 6);

                let linkElements = svg.append('g')
                    .selectAll('line')
                    .data(links)
                    .enter()
                    .append('line')
                    .attr("marker-end", "url(#resolved)")
                    .attr('stroke-width', 2)
                    .attr('stroke', "rgba(50,50,50)");

                let linkTextElements = svg.append('g')
                    .selectAll('.relation')
                    .data(links)
                    .enter()
                    .append('text')
                    .text(function (link) {
                        return link.relation
                    })
                    .attr('font-size', 11)
                    .attr('dx', 0)
                    .attr('dy', 0);

                let marker = svg.append("marker")
                    .attr("id", "resolved")
                    .attr("markerUnits", "userSpaceOnUse")
                    .attr("viewBox", "0 -5 10 10")//坐标系的区域
                    .attr("refX", 32)//箭头坐标
                    .attr("refY", -1)
                    .attr("markerWidth", 12)//标识的大小
                    .attr("markerHeight", 12)
                    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
                    .attr("stroke-width", 2)//箭头宽度
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
                    .attr('fill', '#000000');//箭头颜色

                simulation.nodes(nodes).on('tick', () => {
                    nodeElements.attr('transform', function (node) {
                        return "translate(" + node.x + "," + node.y + ")";
                    });
                    nodeTextElements.attr('transform', function (node) {
                        return "translate(" + node.x + "," + node.y + ")"
                    });
                    linkElements.attr('d', function (link) {
                        return 'M ' + link.source.x + ' ' + link.source.y + ' L ' + link.target.x + ' ' + link.target.y;
                    }).attr('x1', function (link) {
                        return link.source.x;
                    }).attr('y1', function (link) {
                        return link.source.y;
                    }).attr('x2', function (link) {
                        return link.target.x;
                    }).attr('y2', function (link) {
                        return link.target.y;
                    });
                    linkTextElements.attr('transform', function (link) {
                        if (link.target.x < link.source.x) {
                            let bBox = this.getBBox();
                            let rx = bBox.x + bBox.width / 2;
                            let ry = bBox.y + bBox.height / 2;
                            return 'rotate(180 ' + rx + ' ' + ry + ')';
                        } else {
                            return 'rotate(0)';
                        }
                    });
                });

                simulation.force('link').links(links);
            }
        }
    }
</script>

<style lang="less">
    .knowledge-graph-display {
        height: 100%;
        width: 100%;
        padding: 20px 10px;
        box-sizing: border-box;
        .svg-area {
            height: 100%;
            width: 100%;
        }
    }
</style>
