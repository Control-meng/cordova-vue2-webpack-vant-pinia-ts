import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
interface RequestConfig extends AxiosRequestConfig {
    headers?: any;
}
// 请求拦截器
function requestInterceptor(config: InternalAxiosRequestConfig) {
    // 在请求发送前做一些处理
    // config.headers!['Authorization'] = localStorage.getItem('token');
    config.headers!["refresh-token"] = localStorage.getItem("refresh-token");
    return config;
}
// 响应拦截器
function responseInterceptor(config: AxiosResponse) {
    // 响应处理
    return config;
}
// 前缀
const prefix = true
    ? "https://ydfsy.sthjt.zj.gov.cn:8090/radiation-supervise"
    : "https://ydfsy.sthjt.zj.gov.cn:8090/";
// 创建实例
// 赋码实例
export const encode = axios.create({
    baseURL: window.cordova
        ? prefix
        : process.env.NODE_ENV === "production"
        ? prefix
        : "/code", //process.env.NODE_ENV === "production" ? prefix : "/code",
    headers: {
        "X-Identification": "radiationsafety",
    },
    timeout: 8000,
});
encode.interceptors.request.use(requestInterceptor);
encode.interceptors.response.use(responseInterceptor);
// 放射源实例
export const fsy = axios.create({
    baseURL: window.cordova
        ? prefix
        : process.env.NODE_ENV === "production"
        ? prefix
        : "/fsy",
    headers: {
        "X-Identification": "radiationsafety",
    },
    timeout: 8000,
});
fsy.interceptors.request.use(requestInterceptor);
fsy.interceptors.response.use(responseInterceptor);
export const common = axios.create({
    baseURL: window.cordova
        ? prefix
        : process.env.NODE_ENV === "production"
        ? prefix
        : "/",
    headers: {
        "X-Identification": "radiationsafety",
    },
    timeout: 8000,
});
common.interceptors.request.use(requestInterceptor);
common.interceptors.response.use(responseInterceptor);
export const service = axios.create({
    baseURL: window.cordova
        ? prefix
        : process.env.NODE_ENV === "production"
        ? prefix
        : "/service",
    headers: {
        "X-Identification": "radiationsafety",
    },
    // timeout: 8000,
});
service.interceptors.request.use(requestInterceptor);
service.interceptors.response.use(responseInterceptor);
// authox实例
export const authox = axios.create({
    baseURL: window.cordova
        ? prefix
        : process.env.NODE_ENV === "production"
        ? prefix
        : "/authox",
    timeout: 8000,
});
authox.interceptors.request.use(requestInterceptor);
authox.interceptors.response.use(responseInterceptor);
