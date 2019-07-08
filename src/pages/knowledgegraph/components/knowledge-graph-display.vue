<template>
    <div class="knowledge-graph-display">
        <div class="display-area" id="svg-area"></div>
    </div>
</template>

<script>
    import * as d3 from "d3"

    export default {
        name: "knowledge-graph-display",
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

                let relations = [{
                    source: 1,
                    target: 2,
                    relation: '关系1'
                }, {
                    source: 1,
                    target: 3,
                    relation: '关系2'
                }];

                let displayDiv = $('#svg-area');
                let width = displayDiv[0].clientWidth;
                let height = displayDiv[0].clientHeight;
                let svg = d3.select('#svg-area')
                    .append('svg')
                    .attr('width', `${width}`)
                    .attr('height', `${height}`);
                svg.selectAll("*").remove();
                let simulation = d3.forceSimulation()
                    .force('link', d3.forceLink().id(function (link) {
                        return link.id;
                    }).strength(120))
                    .force('charge', d3.forceManyBody().strength(-120))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                let linkElements = svg.append('g')
                    .attr('class', "links")
                    .selectAll('line')
                    .data(relations)
                    .enter()
                    .append('line')
                    .attr('stroke-width', 1)
                    .attr('stroke', "rgba(50,50,50,0.2)");

                let nodeElements = svg.append('g')
                    .attr('class', 'nodes')
                    .selectAll('circle')
                    .data(nodes)
                    .enter()
                    .append('circle')
                    .attr('r', 10)
                    .attr('fill', function (d) {
                        return d.level === 1 ? '#408080' : '#01a0f1';
                    });

                let textElements = svg.append('g')
                    .attr('class', 'texts')
                    .selectAll('text')
                    .data(nodes)
                    .enter()
                    .append('text')
                    .text(function (node) {
                        return node.label
                    })
                    .attr('font-size', 15)
                    .attr('dx', 15)
                    .attr('dy', 4);

                simulation.nodes(nodes).on('tick', () => {
                    nodeElements.attr('cx', function (node) {
                        return node.x;
                    }).attr('cy', function (node) {
                        return node.y;
                    });
                    textElements.attr('x', function (node) {
                        return node.x;
                    }).attr('y', function (node) {
                        return node.y;
                    });
                    linkElements.attr('x1', function (link) {
                        return link.source.x;
                    }).attr('y1', function (link) {
                        return link.source.y;
                    }).attr('x2', function (link) {
                        return link.target.x;
                    }).attr('y2', function (link) {
                        return link.target.y;
                    })
                });

                simulation.force('link').links(relations);

                // svg.selectAll('circle')
                //     .data(nodes)
                //     .enter()
                //     .append('circle')
                //     .attr('r', 10)
                //     .style('fill', function (d, i) {
                //         return color(i);
                //     })
                //     .call(d3.drag()
                //         .on('start', function (d) {
                //             if (!d3.event.active) {
                //                 simulation.alphaTarget(0.8).restart();
                //             }
                //             d.fx = d.x;
                //             d.fy = d.y;
                //         })
                //         .on('drag', function (d) {
                //             d.fx = d.event.x;
                //             d.fy = d.event.y;
                //         })
                //         .on('end', function (d) {
                //             if (!d3.event.active) {
                //                 simulation.alphaTarget(0);
                //             }
                //             d.fx = null;
                //             d.fy = null;
                //         })
                //     );
                //
                // svg.selectAll('text')
                //     .data(nodes)
                //     .enter()
                //     .append('text')
                //     .style('font-size', '12px')
                //     .style('fill', '#000')
                //     .attr('dx', 0)
                //     .attr('dy', 0)
                //     .text(function (d) {
                //         return d.name;
                //     });
                //
                // svg.selectAll('.relation')
                //     .data(relations)
                //     .enter()
                //     .append('text')
                //     .style('fill', 'red')
                //     .style('font-size', '11px')
                //     .attr('class', 'relation')
                //     .attr('dx', 0)
                //     .attr('dy', 0)
                //     .text(function (d) {
                //         return d.relation;
                //     });
                //
                // svg.selectAll('line')
                //     .data(relations)
                //     .enter()
                //     .append('line')
                //     .style('stroke', '#ccc')
                //     .style('stroke-width', 2);
                //
                // simulation.on('tick', function () {
                //     svg.selectAll('circle')
                //         .attr('cx', function (d) {
                //             return d.x;
                //         })
                //         .attr('cy', function (d) {
                //             return d.y;
                //         });
                //     svg.selectAll('text')
                //         .attr('x', function (d) {
                //             return d.x;
                //         })
                //         .attr('y', function (d) {
                //             return d.y;
                //         });
                //     svg.selectAll('line')
                //         .attr('x1', function (d) {
                //             return d.source.x;
                //         })
                //         .attr('y1', function (d) {
                //             return d.source.y;
                //         })
                //         .attr('x2', function (d) {
                //             return d.target.x;
                //         })
                //         .attr('y2', function (d) {
                //             return d.target.y;
                //         });
                //     svg.selectAll('.relation')
                //         .attr('x', function (d) {
                //             return (d.source.x + d.target.x) / 2;
                //         })
                //         .attr('y', function (d) {
                //             return (d.source.y + d.target.y) / 2;
                //         });
                // })
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
        .display-area {
            height: 100%;
            width: 100%;
        }
    }
</style>
