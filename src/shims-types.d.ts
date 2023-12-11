import Vue from 'vue';
import Router, { RouteMeta } from 'vue-router';

declare module 'vue/types/vue' {
    interface Vue {
        $message: any;
        $http: any;
    }
}

declare module 'vue-router/types/router' {
    interface Route {
        meta: RouteMeta & { key: string, keepAlive: boolean, noAuth };
    }
}
