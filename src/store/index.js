import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

let windowH = $(window).height();

export default new Vuex.Store({
    strict: debug,
    state: {
        mainHeight: windowH
    }
});
