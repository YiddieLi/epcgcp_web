<template>
    <div class="tree-graph" :style="{height: pageHeight + 'px'}">
        <div class="tool-area">
            <el-button @click="draw">绘制</el-button>
        </div>
        <div class="graph-show-area">
            <svg id="container-svg">
                <g id="tree-svg"></g>
            </svg>
        </div>
    </div>
</template>

<script>
    import {drawTreeGraph} from "../../mixins/treeGraph.js"

    export default {
        name: "tree-graph",
        data() {
            return {
                pageHeight: 0,
                pageWidth: 0,

            }
        },
        methods: {
            draw() {
                let data = {
                    name: "研判分组",
                    children: [{
                        name: "研判",
                        children: [
                            {
                                name: "事件档案",
                                children: [
                                    {name: "线索", value: 100},
                                    {name: "目标", value: 100},
                                    {name: "点位", value: 100},
                                    {name: "", value: ""}
                                ]
                            },
                            {name: "线索", value: 100},
                            {name: "目标", value: 100},
                            {name: "点位", value: 100}
                        ]
                    }, {
                        name: "时间节点",
                        children: [
                            {name: "线索", value: 100},
                            {name: "目标", value: 100},
                            {name: "点位", value: 100}
                        ]
                    }, {
                        name: "事件档案",
                        children: [
                            {name: "线索", value: 100},
                            {name: "目标", value: 100},
                            {name: "点位", value: 100}
                        ]
                    }
                    ]
                };
                drawTreeGraph("#container-svg", "#tree-svg", data);
                // drawCollapsibleTree("#container-svg", "#tree-svg");
            }
        },
        mounted() {
            let self = this;
            self.pageHeight = this.$store.state.mainHeight;
        }
    }
</script>

<style scoped lang="less">
    @import "../../css/global.less";

    .tree-graph {
        height: 100%;
        width: 100%;

        .tool-area {
            float: left;
            width: 300px;
            height: 100%;
            border-left: 1px solid @borderColor;
            box-sizing: border-box;
        }

        .graph-show-area {
            float: left;
            width: ~'calc(100% - 300px)';
            height: 100%;
            overflow: auto;

            svg {
                height: 100%;
                width: 100%;
                padding: 10px;
                box-sizing: border-box;
                overflow: auto;
            }
        }
    }
</style>