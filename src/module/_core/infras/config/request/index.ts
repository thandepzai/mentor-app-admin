import axios, { AxiosError, AxiosInstance } from "axios";
import { IFailResponse, IResponseData, ISuccessResponse } from "../type/apiReponse";
import { isOnServer } from "../../util/isOnServer";
import { SystemService } from "@module/_core/domain/service/config/system";
import Exception from "@lib/exception/Exception";
import { delay } from "@lib/util/functions";
import { AuthService } from "@module/auth/domain/service/auth";
import { displayErrorNoti } from "../../util/notification";
import { AuthEndpoint } from "@module/auth/infras/config/endpointUrl";

interface RequesterOptions<Model> {
    requestFunc?: (url: string) => Promise<{ data: IResponseData } | Response>;
    boundedTime?: number;
    ignoreStatus?: boolean;
    handleData?: (data: ISuccessResponse) => Model;
}

class Requester {
    public mapServerAxios: AxiosInstance;
    public refreshTokenRequest?: Promise<void>;

    constructor() {
        this.mapServerAxios = axios.create({
            timeout: 30000,
            headers: {
                "Content-Type": "application/json"
            }
        });
        this.mapServerAxios.interceptors.request.use((config) => {
            if (!isOnServer) {
                const accessToken = localStorage.getItem("ACCESS_TOKEN");
                if (accessToken) {
                    config.headers.Authorization = "Bearer " + localStorage.getItem("ACCESS_TOKEN");
                }
            }
            config.params = {
                ...config.params,
                sysId: SystemService.getSystemData()
            };

            return config;
        });

        if (!isOnServer) {
            const accessToken = localStorage.getItem("ACCESS_TOKEN");
            if (accessToken) {
                const originalFetch = window.fetch;
                window.fetch = function (input, init) {
                    if (!init) {
                        init = {};
                    }
                    if (!init.headers) {
                        init.headers = new Headers();
                    }

                    input = requester.addQueryParams(input.toString());

                    // init.headers could be:
                    //   `A Headers object, an object literal,
                    //    or an array of two-item arrays to set request’s headers.`
                    if (init.headers instanceof Headers) {
                        init.headers.append("Authorization", "Bearer " + localStorage.getItem("ACCESS_TOKEN"));
                    } else if (init.headers instanceof Array) {
                        init.headers.push(["Authorization", "Bearer " + localStorage.getItem("ACCESS_TOKEN")]);
                    } else {
                        // object ?
                        init.headers["Authorization"] = "Bearer " + localStorage.getItem("ACCESS_TOKEN");
                    }
                    return originalFetch(input, init);
                };
            }
        }
    }

    addQueryParams(url: string) {
        const newUrl =
            url +
            `${url.includes("?") ? "&sysId=" + SystemService.getSystemData() : "?sysId=" + SystemService.getSystemData()}`;
        return newUrl;
    }

    call =
        <Model>({
            requestFunc = (url = "") => this.mapServerAxios.get(url),
            boundedTime = 0,
            ignoreStatus = false,
            handleData = (data: ISuccessResponse) => data as Model
        }: RequesterOptions<Model> = {}) =>
        async (url = "") => {
            const beforeTime = Date.now();
            try {
                const data = await this.handleRequest(requestFunc, url);

                if (Date.now() - beforeTime < 300) await delay(boundedTime);

                if (data?.status || ignoreStatus) return await handleData(data as ISuccessResponse);
                else {
                    const { errorCode, message, metaData } = data as IFailResponse;
                    throw new Exception(errorCode, message, metaData);
                }
            } catch (error) {
                if (Date.now() - beforeTime < 300) await delay(boundedTime);
                if (error instanceof AxiosError) {
                    // console.log("ERROR", url, JSON.stringify(error.response?.data, null, 4));
                    const data: IFailResponse = error.response?.data;
                    if (data) throw new Exception(data.errorCode, data.message, data.metaData, error);
                    else throw new Exception(error.response?.status, error.message, undefined, error);
                } else if (error instanceof Exception) {
                    throw new Exception(error.code, error.message, error.metaData, error);
                } else throw error;
            }
        };

    handleRequest = async (
        requestFunc: (url: string) => Promise<{ data: IResponseData } | Response>,
        url = ""
    ): Promise<IResponseData> => {
        try {
            const response = await requestFunc(url);
            if (response instanceof Response) {
                return response.json();
            }
            return response.data;
        } catch (error: any) {
            if (isOnServer) throw error;
            // code == 4010 for token (access || refresh) invalid session
            // code == 4011 for access_token expired
            // code == 4012 for refresh_token expired
            // code == 4013 for no auth token (access || refresh)
            // code == 4014 for token (access || refresh) invalid (no user stick with)
            if (error.response?.data?.errorCode === 4010) {
                displayErrorNoti({
                    message: "Bạn đã đăng nhập ở nơi khác",
                    description: "Đang đăng xuất, vui lòng đăng nhập lại để sử dụng web !",
                    duration: 5
                });
                setTimeout(() => {
                    AuthService.logout();
                }, 2000);
            } else if (
                error.response?.data?.errorCode === 4012 ||
                error.response?.data?.errorCode === 4013 ||
                error.response?.data?.errorCode === 4014
            ) {
                displayErrorNoti({
                    message: "Phiên đăng nhập hết hạn",
                    description: "Đang đăng xuất, vui lòng đăng nhập lại để sử dụng web !",
                    duration: 5
                });
                setTimeout(() => {
                    AuthService.logout();
                }, 2000);
            } else if (error.response?.data?.errorCode === 4011) {
                if (!this.refreshTokenRequest) {
                    this.refreshTokenRequest = this.refreshToken()
                        .then((data) => {
                            localStorage.setItem("user", JSON.stringify(data.user));
                            localStorage.setItem("ACCESS_TOKEN", data.accessToken);
                        })
                        .finally(() => {
                            this.refreshTokenRequest = undefined;
                        });
                }
                await this.refreshTokenRequest;

                return this.handleRequest(requestFunc, url);
            }
            throw error;
        }
    };

    refreshToken = async () => {
        try {
            const data = await this.call({
                requestFunc: () =>
                    this.mapServerAxios.get(AuthEndpoint.refreshToken(), {
                        withCredentials: true
                    }),
                handleData: (data) => data.data
            })();

            return data;
        } catch (error) {
            throw error;
        }
    };
}

export const requester = new Requester();
