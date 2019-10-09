import Vue from "vue";
import Router from "vue-router";
import Login from "../pages/login/login.vue";
import KnowledgeGraph from "../pages/knowledgegraph/knowledge-graph.vue";
import TreeGraph from "../pages/treegraph/tree-graph.vue";
import App from "../App.vue";
import MindGraph from "../pages/mindgraph/mind-graph.vue"

Vue.use(Router);

export const constantRouterMap = [{
    path: "/",
    component: App,
    redirect: "/login",
    children: [{
        path: "/login",
        component: Login,
        hidden: true
    }]
}, {
    path: "/knowledgegraph",
    component: KnowledgeGraph,
    hidden: true
}, {
    path: "/tree",
    component: TreeGraph,
    hidden: true
}, {
    path: "/mind",
    component: MindGraph,
    hidden: true
}];

export default new Router({
    mode: "history",
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});
