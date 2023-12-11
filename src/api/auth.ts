import { authox as axios } from "@/utils/api";
export class AuthController {
    // 账号密码登录
    // 登录
    async login(params: {
        username: string;
        password: string;
        withToken?: boolean;
        mode?: "rsa" | "normal";
    }) {
        const url = "/api/waterloo/login";
        const { data } = await axios.post<{
            message: string;
            statusCode: string;
            [key: string]: any;
        }>(url, { ...params });
        return data;
    }
    // 免登
    async autoLogin(params: {
        username: string;
        password: string;
        withToken?: boolean;
    }) {
        const url = "/api/waterloo/login";
        const { data } = await axios.post<{
            message: string;
            statusCode: string;
            [key: string]: any;
        }>(url, { ...params, authType: "zzdmd" });
        return data;
    }
    // 获取鉴权ticket
    async getTicket() {
        const url = "/api/zzd/ticket";
        const { data } = await axios.get<any>(url, {});
        return data;
    }
    // 路由守卫跳转时候check,目的:刷新token,确保登录状态
    async check(
        token?: string
    ): Promise<{ jti: string; sub?: string; userId: string }> {
        const { data } = await axios.get<{ jti: string; sub?: string }>(
            "/api/waterloo/check"
        );
        const userId = data.sub ?? data.jti;
        return { ...data, userId };
    }
    // 注销登录
    async logout() {
        const url = "/api/waterloo/logout";
        const { data } = await axios.get<any>(url, {});
        return data;
    }
    // 用户信息
    async curUserInfo() {
        const url = "/rest/authox/curUser";
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Refresh-Token": "kXkVeBDWPX-yD68IpNz7V",
            },
        };
        const { data } = await axios.get<any>(url);
        return data;
    }
}
export const authController = new AuthController();
