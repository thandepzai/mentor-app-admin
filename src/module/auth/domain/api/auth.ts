// import { mapStudyApi } from "@infrastructure/config/endpointUrl/mapstudy";
import { appRequest } from "module/_core/infras/config/request/axios";
import { requester } from "module/_core/infras/config/request/requester";
import { LoginDTO, LoginResponseDTO } from "../dto/login";
import { MeDTO } from "../dto/me";
import { RegisterDTO, RegisterResponseDTO } from "../dto/register";
import { AuthEndpoint } from "../../infras/config/endpointUrl";

export class AuthApi {
    static async login(loginDto: LoginDTO) {
        return requester<{
            user: MeDTO;
            accessToken: string;
        }>({
            requestFunc: () =>
                appRequest.mapServer.post(AuthEndpoint.login(), loginDto, {
                    withCredentials: true
                }),
            boundedTime: 200,
            handleData: (data: LoginResponseDTO) => data.data
        })();
    }

    static async loginGoogle(token: string) {
        return requester<{ user: MeDTO; accessToken: string }>({
            requestFunc: () =>
                appRequest.mapServer.post(AuthEndpoint.login_google(), {
                    token
                }),
            boundedTime: 200,
            handleData: (data: LoginResponseDTO) => data.data
        })();
    }

    static async register(registerDto: RegisterDTO) {
        const formData = new FormData();

        formData.append("data", JSON.stringify(registerDto));

        return requester<MeDTO>({
            requestFunc: () =>
                appRequest.mapServer.post(AuthEndpoint.register(), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }),
            boundedTime: 200,
            handleData: (data: RegisterResponseDTO) => data.data.user
        })();
    }

    static async logout() {
        return requester({
            requestFunc: () =>
                appRequest.mapServer.get(AuthEndpoint.logout(), {
                    withCredentials: true
                })
        })();
    }
}
