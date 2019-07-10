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
                <ul>
                    <!--<template v-for="(item,$index) in nodeTextKeyList">-->
                    <!--<li :key="$index" @click="selectNodeTextKey(item)"-->
                    <!--:class="{'selected-node-text-key':selectedNodeTextKey&&selectedNodeTextKey===item}">-->
                    <!--<span>{{item}}</span>-->
                    <!--</li>-->
                    <!--</template>-->
                </ul>
            </div>
        </div>
        <div class="info-area">
            <div class="info-area-title">
                <span>基本信息</span>
            </div>
        </div>
    </div>
</template>

<script>
    import KnowledgeGraphDisplay from './components/knowledge-graph-display.vue'
    import Pie from './components/pie.vue'
    import * as d3 from 'd3'
    import {drawKnowledgeGraph} from '../../mixins/knowledgeGraph.js'

    export default {
        name: "knowledge-graph",
        components: {KnowledgeGraphDisplay, Pie},
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
                selectedNodeTextKey: null
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
                    id: 1
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
                let data = {
                    nodes: nodes,
                    links: links
                };
                self.nodeTextKeyList = ['id', 'name'];
                self.selectedNodeTextKey = null;
                let containerSvgId = '#container-svg';
                let graphId = '#network-graph';
                drawKnowledgeGraph(containerSvgId, graphId, data);
            },
            selectTag(item) {
                item.isSelected = !item.isSelected;
            }
        },
        mounted() {
            let self = this;
            self.pageHeight = this.$store.state.mainHeight;
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
                height: ~'calc(100% - 37px)';
                width: 100%;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .labels-bar {
                width: 100%;
                height: 20px;
                line-height: 20px;
                padding: 8px 0;
                cursor: default;
                border-top: 1px solid @borderColor;
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
        }
    }
</style>
