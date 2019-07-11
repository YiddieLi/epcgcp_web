<template>
    <div class="knowledge-graph darkGreyFont" :style="{height: pageHeight + 'px'}">
        <div class="search-area">
            <div class="search-area-title">
                <span>初始化查询</span>
            </div>
            <div class="search-condition">
                <el-tabs v-model="searchModel" @tab-click="changeSearchModel">
                    <el-tab-pane label="属性模式" name="attrModel">
                        <div class="attr-model">
                            <el-input v-model="attrModelKeywords" size="small" placeholder="请输入关键字" clearable
                                      @keyup.enter.native="searchKnowledgeGraph">
                                <i slot="prefix" class="el-input__icon el-icon-search"
                                   @click="searchKnowledgeGraph"></i>
                            </el-input>
                            <div style="margin-top: 10px;">
                                <span>查询标签范围：</span>
                            </div>
                            <div class="tag-list">
                                <template v-for="(item,$index) in attrLabelList">
                                    <div class="tag" :key="$index" :class="{'selected-tag':item.isSelected}"
                                         @click="selectTag(item)">
                                        <span>{{item.name}}</span>
                                    </div>
                                </template>
                            </div>
                            <div class="split-line"></div>
                            <div style="margin-top: 5px">
                                <span>查询属性选择：</span>
                            </div>
                            <div class="tag-list">
                                <template v-for="(item,$index) in attrList">
                                    <div class="tag" :key="$index" :class="{'selected-tag':item.isSelected}"
                                         @click="selectTag(item)">
                                        <span>{{item.name}}</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="节点标签模式" name="nodeLabelModel">
                        <div class="node-label-model">
                            <el-input v-model="nodeLabelModelKeywords" size="small" placeholder="请输入关键字" clearable
                                      @keyup.enter.native="searchKnowledgeGraph">
                                <i slot="prefix" class="el-input__icon el-icon-search"
                                   @click="searchKnowledgeGraph"></i>
                            </el-input>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="关系类别模式" name="relationModel">
                        <div class="relation-model">
                            <el-input v-model="relationModelKeywords" size="small" placeholder="请输入关键字" clearable
                                      @keyup.enter.native="searchKnowledgeGraph">
                                <i slot="prefix" class="el-input__icon el-icon-search"
                                   @click="searchKnowledgeGraph"></i>
                            </el-input>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="show-area">
            <!--<knowledge-graph-display ref="knowledgeGraphDisplay"></knowledge-graph-display>-->
            <!--<pie ref="pie"></pie>-->
            <svg class="graph-area" id="container-svg">
                <g id="network-graph"></g>
            </svg>
            <div class="labels-bar" id="labels-bar">
                <ul></ul>
            </div>
        </div>
        <div class="info-area">
            <div class="info-area-title">
                <span>基本信息</span>
            </div>
            <div class="info-area-content">
                <template v-for="(item,$key) in selectedNodeInfo">
                    <div :key="$key">
                        <span>{{$key}}：{{item}}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {drawKnowledgeGraph} from '../../mixins/knowledgeGraph.js'
    import * as d3 from 'd3'

    export default {
        name: "knowledge-graph",
        data() {
            return {
                pageHeight: 0,
                searchModel: "attrModel",
                attrModelKeywords: null,
                nodeLabelModelKeywords: null,
                relationModelKeywords: null,
                attrLabelList: [{
                    name: "document",
                    isSelected: false
                }, {
                    name: "notice",
                    isSelected: false
                }, {
                    name: "plan",
                    isSelected: false
                }, {
                    name: "document",
                    isSelected: false
                }],
                attrList: [{
                    name: "type",
                    isSelected: false
                }],
                nodeTextKeyList: [],
                selectedNodeInfo: null,
                data: null,
                nodeMenuData: null
            }
        },
        methods: {
            changeSearchModel(tab, event) {
                let self = this;

            },
            searchKnowledgeGraph() {
                let self = this;
                // self.$refs.knowledgeGraphDisplay.setKnowledgeGraphData();
                let nodes = [{
                    name: '节点1节点1节点1节点1',
                    id: 1,
                    properties: {
                        name: '节点1节点1节点1',
                        date: '2019年7月11日',
                        description: '描述文字'
                    }
                }, {
                    name: '节点2',
                    id: 2
                }, {
                    name: '节点3',
                    id: 3
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
                self.data = {
                    nodes: nodes,
                    links: links
                };
                self.nodeTextKeyList = ['id', 'name'];
                self.selectedNodeTextKey = null;
                drawKnowledgeGraph('#container-svg', '#network-graph', self.data, self.afterClickNodeFunc, self.nodeMenuData);
            },
            selectTag(item) {
                item.isSelected = !item.isSelected;
            },
            afterClickNodeFunc(node) {
                let self = this;
                self.selectedNodeInfo = null;
                if (node && node.properties)
                    self.selectedNodeInfo = JSON.parse(JSON.stringify(node.properties));
            },
            generateNodeMenuData() {
                console.log('sd');
                let self = this;
                return [
                    [{
                        text: '扩展关联节点',
                        data: [[{
                            text: '1层',
                            func: function () {
                                let clickNode = d3.select(this).datum();
                                self.getExpandNodes(clickNode, 1);
                            }
                        }, {
                            text: '2层',
                            func: function () {
                                let clickNode = d3.select(this).datum();
                                self.getExpandNodes(clickNode, 2);
                            }
                        }, {
                            text: '3层',
                            func: function () {
                                let clickNode = d3.select(this).datum();
                                self.getExpandNodes(clickNode, 3);
                            }
                        }]]
                    }, {
                        text: '隐藏节点',
                        func: function () {
                            let clickNode = d3.select(this).datum();
                            let nodes = [];
                            self.data.nodes.forEach(node => {
                                if (node.id !== clickNode.id) nodes.push(node);
                            });
                            let links = [];
                            self.data.links.forEach(link => {
                                if (link.source !== clickNode && link.target !== clickNode) links.push(link);
                            });
                            self.data = {
                                nodes: nodes,
                                links: links
                            };
                            drawKnowledgeGraph('#container-svg', '#network-graph', self.data, self.afterClickNodeFunc, self.nodeMenuData);
                        }
                    }, {
                        text: '展示最短路径',
                        func: function () {
                            console.log('展示最短路径')
                        }
                    }]
                ];
            },
            getExpandNodes(node, level) {
                let self = this;
                self.data.nodes.push({
                    name: '节点4',
                    id: 4
                });
                self.data.links.push({
                    source: 2,
                    target: 4,
                    relation: '哈哈哈'
                });
                console.log(self.data, 'self.data');
                drawKnowledgeGraph('#container-svg', '#network-graph', self.data, self.afterClickNodeFunc, self.nodeMenuData);
            }
        },
        mounted() {
            let self = this;
            self.pageHeight = this.$store.state.mainHeight;
            self.nodeMenuData = self.generateNodeMenuData();
            $(document).ready(function () {
                self.searchKnowledgeGraph();
            });

        }
    };
</script>

<style lang="less">
    @import "../../css/global.less";
    @import "../../css/graph.less";

    .knowledge-graph {
        height: 100%;
        width: 100%;
        background-color: @lightGreyBgColor;
        overflow: hidden;
        .search-area {
            float: left;
            width: 20%;
            height: 100%;
            box-shadow: 2px 0 10px @boxShadowColorGrey;
            background-color: @whiteColor;
            box-sizing: border-box;
            padding: 0 10px;
            line-height: 30px;
            .search-area-title {
                height: 30px;
                font-weight: bold;
                color: @darkGreenColor;
            }
            .search-condition {
                .el-tabs__item:hover {
                    color: @darkGreenColor;
                }
                .el-tabs__item.is-active {
                    color: @darkGreenColor;
                }
                .el-tabs__active-bar {
                    background-color: @darkGreenColor;
                }
                .attr-model {
                    .tag-list {
                        display: inline-block;
                        .tag {
                            float: left;
                            height: 30px;
                            border-radius: 30px;
                            padding: 0 10px;
                            background-color: @lightGreyBgColor;
                            margin: 0 10px 5px 0;
                            cursor: default;
                            &:hover {
                                background-color: @darkGreenColor;
                                color: @whiteColor;
                            }
                        }
                        .selected-tag {
                            background-color: @darkGreenColor;
                            color: @whiteColor;
                        }
                    }
                }
                .node-label-model {

                }
                .relation-model {

                }
            }
        }
        .show-area {
            float: left;
            width: 60%;
            height: 100%;
            .graph-area {
                height: ~'calc(100% - 40px)';
                width: 100%;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .labels-bar {
                width: 100%;
                height: 40px;
                line-height: 20px;
                padding: 8px 0;
                cursor: default;
                border-top: 1px solid @borderColor;
                box-sizing: border-box;
                ul {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
            }
        }
        .info-area {
            float: left;
            width: 20%;
            height: 100%;
            box-shadow: -2px 0 10px @boxShadowColorGrey;
            background-color: @whiteColor;
            line-height: 30px;
            .info-area-title {
                height: 30px;
                background-color: @darkGreenColor;
                color: @whiteColor;
                font-weight: bold;
                padding: 0 10px;
            }
            .info-area-content {
                height: ~'calc(100% - 30px)';
                overflow: auto;
                padding: 5px 10px;
            }
        }
    }
</style>
