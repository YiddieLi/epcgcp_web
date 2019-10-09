<template>
    <div class="login">
        <el-button @click="gotoKnowledgeGraph">知识图谱</el-button>
        <el-button @click="gotoTreeGraph">树状图</el-button>
        <el-button @click="gotoMindGraph">思维导图</el-button>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {}

        },
        methods: {
            gotoKnowledgeGraph() {
                let self = this;
                let routeData = self.$router.resolve({
                    path: '/knowledgegraph'
                });
                window.open(routeData.href, '_blank');
            },
            gotoTreeGraph(){
                let self = this;
                let routeData = self.$router.resolve({
                    path: '/tree'
                });
                window.open(routeData.href, '_blank');
            },
            gotoMindGraph(){
                let self = this;
                let routeData = self.$router.resolve({
                    path: '/mind'
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>

<style lang="less">
    .login {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
    }
</style>
