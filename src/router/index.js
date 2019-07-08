import Vue from "vue";
import Router from "vue-router";
import KnowledgeGraph from "../pages/knowledgegraph/knowledge-graph.vue";

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("../pages/login/login"),
    hidden: true
  },
  {
    path: "/",
    component: KnowledgeGraph,
    redirect: "/knowledgegraph",
    name: "KnowledgeGraph",
    hidden: true,
    children: [
      {
        path: "knowledgegraph",
        component: () => import("../pages/knowledgegraph/knowledge-graph")
      }
    ]
  }
];

export default new Router({
  mode: "history",
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});
