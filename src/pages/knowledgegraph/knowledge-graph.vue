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
                                         @click="selectAttrLabel(item)" v-if="$index<=maxAttrLabelIndex">
                                        <span>{{item.name}}</span>
                                    </div>
                                </template>
                                <div class="tag" @click="maxAttrLabelIndex+=10"
                                     style="width: 30px;text-align: center;">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </div>
                            <div class="split-line"></div>
                            <div style="margin-top: 5px">
                                <span>查询属性选择：</span>
                            </div>
                            <div class="tag-list">
                                <template v-for="(item,$index) in attrList">
                                    <div class="tag" :key="$index"
                                         :class="{'selected-tag':selectedAttr&&selectedAttr.id===item.id}"
                                         @click="selectAttr(item)">
                                        <span>{{item.displayname}}</span>
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
                            <div style="margin-top: 10px;">
                                <span>查询标签范围：</span>
                            </div>
                            <div class="tag-list">
                                <template v-for="(item,$index) in attrLabelList">
                                    <div class="tag" :key="$index"
                                         :class="{'selected-tag':selectedLabelModelLabel&&selectedLabelModelLabel.name===item.name}"
                                         @click="selectLabelModelLabel(item)" v-if="$index<=maxLabelModelLabelIndex">
                                        <span>{{item.name}}</span>
                                    </div>
                                </template>
                                <div class="tag" @click="maxLabelModelLabelIndex+=10"
                                     style="width: 30px;text-align: center;">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </div>
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
                        <span style="font-weight: bold">{{$key}}：</span>
                        <span>{{item}}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import {drawKnowledgeGraph} from '../../mixins/knowledgeGraph.js'
    import * as d3 from 'd3'
    import {
        KgNodesFuzzy,
        CommonNeo4jLabels,
        KgNeo4jConfigProperties,
        KgNodesNodeLabel
    } from '../../resource/resource.js'

    export default {
        name: "knowledge-graph",
        data() {
            return {
                pageHeight: 0,
                searchModel: "attrModel",
                attrModelKeywords: null,
                nodeLabelModelKeywords: null,
                relationModelKeywords: null,
                attrLabelList: [],
                attrList: [{
                    name: "type"
                }],
                selectedAttr: null,
                nodeTextKeyList: [],
                selectedNodeInfo: null,
                data: null,
                nodeMenuData: null,
                maxAttrLabelIndex: 9,
                selectedLabelModelLabel: null,
                maxLabelModelLabelIndex: 9,
            }
        },
        methods: {
            changeSearchModel(tab, event) {
                let self = this;

            },
            searchKnowledgeGraph() {
                let self = this;
                self.data = {
                    nodes: [],
                    links: []
                };
                let nodeLabels = [];
                switch (self.searchModel) {
                    case 'attrModel':
                        self.attrLabelList.forEach(item => {
                            if (item.isSelected) nodeLabels.push(item.name);
                        });
                        KgNodesFuzzy.gets({
                            params: {
                                keyword: self.attrModelKeywords,
                                nodeLabels: nodeLabels,
                                pageNum: 1,
                                pageSize: 25,
                                propertyKey: self.selectedAttr ? self.selectedAttr.name : null
                            }
                        }).then(({data}) => {
                            if (data && data.list) {
                                let nodes = [];
                                data.list.forEach(item => {
                                    let node = JSON.parse(JSON.stringify(item.properties));
                                    node.id = JSON.parse(JSON.stringify(item.id));
                                    node.labels = JSON.parse(JSON.stringify(item.labels));
                                    node.properties = JSON.parse(JSON.stringify(item.properties));
                                    nodes.push(node);
                                });
                                self.data.nodes = nodes;
                                drawKnowledgeGraph('#container-svg', '#network-graph', self.data, self.afterClickNodeFunc, self.nodeMenuData);
                            }
                        });
                        break;
                    case 'nodeLabelModel':
                        KgNodesNodeLabel.gets({
                            params: {
                                nodeLabel: self.selectedLabelModelLabel.name,
                                pageNum: 1,
                                pageSize: 25
                            }
                        }).then(({data}) => {
                            if (data && data.list) {
                                let nodes = [];
                                data.list.forEach(item => {
                                    let node = JSON.parse(JSON.stringify(item.properties));
                                    node.id = JSON.parse(JSON.stringify(item.id));
                                    node.labels = JSON.parse(JSON.stringify(item.labels));
                                    node.properties = JSON.parse(JSON.stringify(item.properties));
                                    nodes.push(node);
                                });
                                self.data.nodes = nodes;
                                drawKnowledgeGraph('#container-svg', '#network-graph', self.data, self.afterClickNodeFunc, self.nodeMenuData);
                            }
                        });
                        break;
                }


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

                let links = [];

                // let links = [{
                //     source: 1,
                //     target: 2,
                //     relation: '关系1'
                // }, {
                //     source: 1,
                //     target: 3,
                //     relation: '关系2'
                // }];
                self.data = {
                    nodes: nodes,
                    links: links
                };
                // self.nodeTextKeyList = ['id', 'name'];
                // self.selectedNodeTextKey = null;

            },
            selectAttrLabel(item) {
                item.isSelected = !item.isSelected;
            },
            nextPageAttrLabel() {
                let self = this;
                self.maxAttrLabelIndex += 10;
            },
            selectAttr(item) {
                let self = this;
                if (self.selectedAttr && self.selectedAttr === item) {
                    self.selectedAttr = null;
                } else {
                    self.selectedAttr = item;
                }
            },
            selectLabelModelLabel(item) {
                let self = this;
                self.selectedLabelModelLabel = item;
            },
            afterClickNodeFunc(node) {
                let self = this;
                self.selectedNodeInfo = null;
                console.log(node, 'node');
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
            },
            initParams() {
                let self = this;
                self.selectedLabelModelLabel = null;
                self.selectedAttr = null;
                self.maxAttrLabelIndex = 9;
                self.attrLabelList = [];
                CommonNeo4jLabels.gets().then(({data}) => {
                    if (data && data.length > 0) {
                        data.forEach(item => {
                            self.attrLabelList.push({
                                name: item,
                                isSelected: false
                            })
                        });
                    }
                });
                self.attrList = [];
                KgNeo4jConfigProperties.gets({
                    params: {
                        pageNum: 1,
                        pageSize: 10000
                    }
                }).then(({data}) => {
                    if (data && data.list) {
                        self.attrList = JSON.parse(JSON.stringify(data.list));
                    }
                });
            }
        },
        mounted() {
            let self = this;
            self.pageHeight = this.$store.state.mainHeight;
            self.nodeMenuData = self.generateNodeMenuData();
            self.initParams();
        }
    };
</script>

<style lang="less">
    @import "../../css/global.less";

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

                circle {
                    cursor: pointer;
                    stroke-opacity: 0.8;
                    stroke-width: 2px;
                    stroke: @darkBlueColor;
                }

                circle:hover {
                    stroke-opacity: 0.5;
                    stroke-width: 5px;
                }

                .selected {
                    stroke-dasharray: 1;
                }

                .selected circle {
                    stroke-width: 5px;
                }

                .selected path {
                    stroke: yellow;
                    stroke-width: 4px !important;
                }

                .finded circle {
                    stroke-width: 20px;
                    stroke: #00FFFB;
                }

                path {
                    fill: none;
                    cursor: pointer;
                    stroke: #01a0f1;
                    stroke-width: 2px;
                }

                path:hover {
                    stroke-width: 4px !important;
                    stroke-opacity: 0.8;
                }

                .route {
                    stroke: red;
                    stroke-width: 5px;
                }

                text {
                    text-anchor: middle;
                    user-select: none;
                    pointer-events: none;
                }

                .node-text {
                    font-size: 10px;
                    fill: white;
                }

                .link-text {
                    font-size: 14px;
                    fill: black;
                }

                .link-marker {
                }

                .labels {
                    margin-left: 10px;
                    float: left;
                    padding: 0 10px;
                    border: 1px solid @darkGreyColor;
                    border-radius: 5px;
                    background-color: @whiteColor;
                }

                .selected-labels {
                    border: 1px solid @darkGreenColor;
                    background-color: @darkGreenColor;
                    color: white;
                }
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
