import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from "axios";
import VueRouter from "vue-router";

interface RequestConfig extends AxiosRequestConfig {
    headers?: any;
}
export const useInterceptors = (http: AxiosInstance, router?: VueRouter) => {
    // 请求拦截器
    http.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            let token = localStorage.getItem("access-token");
            config.headers["access-token"] = token;
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );
    // 响应拦截器
    // http.interceptors.response.use(
    //     res => {
    //         return res;
    //     },
    //     error => {
    //         if (axios.isAxiosError(error)) {
    //             if ((error as AxiosError)?.response?.status === 401) {
    //                 router?.push({ name: 'home' });
    //             }
    //         } else {
    //             return error;
    //         }
    //     },
    // );
};
