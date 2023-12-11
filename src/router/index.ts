import Router from "vue-router";
import Vue from "vue";
import { v4 as uuid } from "uuid";
import { useRouterStore } from "@/stores/router";
import mapRoutes from "./map";
import { RouteConfig } from "vue-router";
import { authController } from "@/api/auth";
Vue.use(Router);

const router = new Router({
    routes: [
        {
            name: "test",
            path: "/test",
            component: () => import("@/views/Test.vue"),
            meta: { level: 0 },
        },
        {
            path: "/",
            meta: { level: -99 },
            redirect: { name: "test" },
        },
    ],
});

// 前置守卫
router.beforeEach(async (to, from, next) => {
    const $routerStore = useRouterStore();
    // const $user = useUserStore();
    if (!to.meta) {
        to.meta = {};
    }
    if (!from.meta) {
        from.meta = {};
    }
    // 实际上所有页面都会被keep-alive,但是用:key了利用vue的key变更会重新创建组件机制来清除缓存
    // 为了防止页面缓存过多,给keep-alive设置了:max=10
    if (to.params.noCache) {
        // 让下一个进入的页面重新初始化
        to.meta.key = uuid();
    } else {
        // 是有router.back/router.go(-1)时,params不会保存,所有实现返回自动缓存
        // 进入页面时候不需要缓存则由跳转的方法进行控制
        if (!to.meta.key) {
            // 给key设置初始值,否则大家都是undefined,则key相同了
            to.meta.key = uuid();
        } else {
            if (!to.meta.keepAlive) {
                // 不缓存的每次重新创建key
                to.meta.key = uuid();
            } else {
                // 需要缓存的组件不用重新设置key
            }
        }
    }
    if (
        (!from.meta.hasOwnProperty("level") && to.meta.level === 0) ||
        to.params.noTransition
    ) {
        $routerStore.setName("");
    } else if (to.meta.level > from.meta.level) {
        $routerStore.setName("slide-left");
    } else if (to.meta.level < from.meta.level) {
        $routerStore.setName("slide-right");
    } else {
        $routerStore.setName("");
    }
    // 守卫

    if (to.name === "login" || to.meta?.noAuth) {
        next();
        return;
    } else {
        try {
            // 用户权限check
            // await authController.check();
            next();
        } catch (e) {
            next(false);
            router.push({ name: "login" });
        }
    }
});

export default router;
