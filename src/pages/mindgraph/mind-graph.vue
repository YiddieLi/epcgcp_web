<template>
    <div class="mind-graph" :style="{height: pageHeight + 'px'}">
        <div class="graph-tool">
            <el-button @click="drawMindGraph">绘制</el-button>
        </div>
        <div class="graph-area">
            <div id="jm-container"></div>
        </div>
    </div>
</template>

<script>
    import * as jsMind from "jsmind"

    export default {
        name: "mind-graph",
        data() {
            return {
                pageHeight: 0
            }
        },
        methods: {
            drawMindGraph() {
                let options = {
                    container: 'jm-container',
                    editable: true,
                    theme: 'primary'
                };
                let mindData = {
                    /* 元数据，定义思维导图的名称、作者、版本等信息 */
                    "meta": {
                        "name": "jsMind-demo-tree",
                        "author": "hizzgdev@163.com",
                        "version": "0.2"
                    },
                    /* 数据格式声明 */
                    "format": "node_tree",
                    /* 数据内容 */
                    "data": {
                        "id": "root", "topic": "jsMind", "children": [
                            {
                                "id": "easy", "topic": "Easy", "direction": "left", "expanded": false, "children": [
                                    {"id": "easy1", "topic": "Easy to show"},
                                    {"id": "easy2", "topic": "Easy to edit"},
                                    {"id": "easy3", "topic": "Easy to store"},
                                    {"id": "easy4", "topic": "Easy to embed"}
                                ]
                            },
                            {
                                "id": "open",
                                "topic": "Open Source",
                                "direction": "right",
                                "expanded": true,
                                "children": [
                                    {"id": "open1", "topic": "on GitHub"},
                                    {"id": "open2", "topic": "BSD License"}
                                ]
                            },
                            {
                                "id": "powerful", "topic": "Powerful", "direction": "right", "children": [
                                    {"id": "powerful1", "topic": "Base on Javascript"},
                                    {"id": "powerful2", "topic": "Base on HTML5"},
                                    {"id": "powerful3", "topic": "Depends on you"}
                                ]
                            },
                            {
                                "id": "other", "topic": "test node", "direction": "left", "children": [
                                    {"id": "other1", "topic": "I'm from local variable"},
                                    {"id": "other2", "topic": "I can do everything"}
                                ]
                            }
                        ]
                    }
                };
                let jm = jsMind.show(options, mindData);
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
    @import "~jsmind/style/jsmind.css";

    .mind-graph {
        height: 100%;
        width: 100%;

        .graph-tool {
            height: 100%;
            width: 20%;
            float: left;
            box-sizing: border-box;
            border-right: 1px solid @borderColor;
            padding: 10px;
        }

        .graph-area {
            height: 100%;
            width: 80%;
            float: left;

            #jm-container {
                height: 100%;
                width: 100%;
            }
        }
    }
</style>