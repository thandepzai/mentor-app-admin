import { AuthEndpoint } from "@module/auth/infras/config/endpointUrl";
import axios, { AxiosInstance } from "axios";
import { showToast } from "lib/component/Toast/Toast";
import { isOnServer } from "module/_core/infras/util/isOnServer";
import { AuthService } from "module/auth/domain/service/auth";
const https = require("https");

class AppRequest {
    public mapServer: AxiosInstance;
    public refreshTokenRequest: any = null;
    public agent: any;

    constructor() {
        this.mapServer = axios.create({
            timeout: 30000,
            headers: {
                "Content-Type": "application/json"
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        this.mapServer.interceptors.request.use(
            (config) => {
                if (!isOnServer) {
                    const accessToken = localStorage.getItem("ACCESS_TOKEN");
                    if (accessToken) {
                        config.headers.Authorization = "Bearer " + localStorage.getItem("ACCESS_TOKEN");
                    }
                }

                return config;
            },
            (error) => Promise.reject(error)
        );
        this.mapServer.interceptors.response.use(
            (response) => response,
            (error) => {
                if (isOnServer) return Promise.reject(error);
                // code == 4010 for token (access || refresh) invalid session
                // code == 4011 for access_token expired
                // code == 4012 for refresh_token expired
                // code == 4013 for no auth token (access || refresh)
                // code == 4014 for token (access || refresh) invalid (no user stick with)
                if (error.response?.data?.errorCode === 4010) {
                    showToast({
                        title: "Bạn đã đăng nhập ở nơi khác",
                        description: "Đang đăng xuất, vui lòng đăng nhập lại để sử dụng web !"
                    });
                    setTimeout(() => {
                        AuthService.logout();
                    }, 2000);
                } else if (
                    error.response?.data?.errorCode === 4012 ||
                    error.response?.data?.errorCode === 4013 ||
                    error.response?.data?.errorCode === 4014
                ) {
                    showToast({
                        title: "Phiên đăng nhập hết hạn",
                        description: "Đang đăng xuất, vui lòng đăng nhập lại để sử dụng web !"
                    });
                    setTimeout(() => {
                        AuthService.logout();
                    }, 2000);
                } else if (error.response?.data?.errorCode === 4011) {
                    this.refreshTokenRequest = this.refreshTokenRequest
                        ? this.refreshTokenRequest
                        : this.refreshToken().finally(() => {
                              this.refreshTokenRequest = null;
                          });

                    return this.refreshTokenRequest
                        .then((data) => {
                            localStorage.setItem("user", JSON.stringify(data.user));
                            localStorage.setItem("ACCESS_TOKEN", data.accessToken);
                            // Dòng này không cần thiết lắm do gọi lại API nó lại lấy AT từ localStorage ra set lại
                            error.response.config.headers.Authorization = data.accessToken;
                            return this.mapServer(error.response.config);
                        })
                        .catch((error) => {
                            return Promise.reject(error);
                        });
                }
                return Promise.reject(error);
            }
        );
    }

    refreshToken = async () => {
        try {
            const { data } = await this.mapServer.get(AuthEndpoint.refreshToken(), {
                withCredentials: true
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    };

    updateTokenMapServer = (token: string | undefined) => {
        if (!token) return delete this.mapServer.defaults.headers.Authorization;
        this.mapServer.defaults.headers.Authorization = "Bearer " + token;
    };
}

export const appRequest = new AppRequest();
