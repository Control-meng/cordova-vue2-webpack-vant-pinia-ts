import "./styles/index.scss";
import "reflect-metadata";
import "@suc/chain";
import "./assets/icofont/icofont.min.css";

import Vue from "vue";
import App from "./App.vue";
import { pinia } from "./stores";
import router from "./router";
import { install, createApp, h } from "vue-demi";
import { prepareApp } from "@/utils/prepareApp";
import { Dialog, Toast, Lazyload } from "vant";
import { RootPage } from "@/components";
import "vant/lib/index.css";
import VConsole from "vconsole";
// process.env.NODE_ENV === "development" &&window.cordova
if (process.env.NODE_ENV === "development" && window.cordova) {
    new VConsole();
}
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Lazyload);
Vue.config.productionTip = false;

install();
Vue.component("root-page", RootPage); // 页面根组件

Vue.config.errorHandler = (err, vm, info) => {
    setTimeout(() => {
        console.log(err, vm, info);
    });
};

async function main() {
    await prepareApp();
    window.$app = createApp({
        pinia,
        router,
        render: () => h(App),
    }).mount("#app");
}

main().catch(console.error);
