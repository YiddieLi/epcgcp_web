import Vue from "vue";
import Router from "vue-router";
import Login from "../pages/login/login.vue";
import KnowledgeGraph from "../pages/knowledgegraph/knowledge-graph.vue";
import TreeGraph from "../pages/treegraph/tree-graph.vue";

Vue.use(Router);

export const constantRouterMap = [{
    path: "/login",
    component: Login,
    hidden: true
}, {
    path: "/",
    component: KnowledgeGraph,
    redirect: "/knowledgegraph",
    name: "KnowledgeGraph",
    hidden: true,
    children: [
        {
            path: "knowledgegraph",
            component: KnowledgeGraph
        }
    ]
}, {
    path: "/tree",
    component: TreeGraph,
    hidden: true
}];

export default new Router({
    mode: "history",
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});
