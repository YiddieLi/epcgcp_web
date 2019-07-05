import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import Vodal from "vodal";
import router from "./router/router";
import "element-ui/lib/theme-chalk/index.css";
import $ from 'jquery'
import './css/app.less'
import store from "./store";

Vue.use(ElementUI);

Vue.component(Vodal.name, Vodal);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {
        let self = this;
        let setFullHeight = () => {
            self.$el.style.minHeight = $(window).height() + 'px';
            window.onresize = () => {
                self.$el.style.minHeight = $(window).height() + 'px';
            };
        };
        setFullHeight();
    }
}).$mount("#app");


