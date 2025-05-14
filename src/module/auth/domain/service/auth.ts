import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobalState } from "lib/hook/useGlobalState";
import { useIsomorphicLayoutEffect } from "lib/hook/useIsomorphicLayoutEffect";
import { AuthApi } from "../api/auth";
import { MeApi } from "../api/me";
import { LoginDTO } from "../dto/login";
import { RegisterDTO } from "../dto/register";
import { IMe } from "../model/me";
import { MeService } from "./me";

export interface IAuth {
    user: IMe;
    accessToken: string;
}

export class AuthService {
    static AUTH_KEY = "AUTH_KEY";

    static useInitAuth = () => {
        const { mutate } = this.useAuth(() => 0);
        const { verifyAuthMutation } = this.useAuthAction();

        useIsomorphicLayoutEffect(() => {
            const auth = this.getAuth();
            if (auth) {
                mutate(auth);
                // appRequest.updateTokenMapServer(auth.accessToken);
                verifyAuthMutation.mutate();
            }
        }, []);
    };

    static useAuth = (select?: (state: IAuth | null) => any) => {
        const { data, mutate } = useGlobalState<IAuth | null>([this.AUTH_KEY], {
            initialData: null,
            notifyOnChangeProps: ["data", "isPending"],
            select
        });

        return {
            isLogin: !!data?.user,
            user: data?.user,
            accessToken: data?.accessToken,
            mutate
        };
    };

    static useAuthAction = () => {
        const queryClient = useQueryClient();
        const meAction = MeService.useMeAction();

        const verifyAuthMutation = useMutation({
            mutationFn: () => MeApi.getMe(),
            onSuccess: (data) => {
                localStorage.setItem("user", JSON.stringify(data));
                queryClient.setQueryData([this.AUTH_KEY], (auth: any) => ({
                    ...auth,
                    user: data
                }));
                meAction.mutateLocal(data);
            },
            onError: errorHandler
        });

        const loginMutation = useMutation({
            mutationFn: (loginDto: LoginDTO) => AuthApi.login(loginDto),
            onSuccess: (data) => {
                // appRequest.updateTokenMapServer(data.accessToken);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("ACCESS_TOKEN", data.accessToken);
                queryClient.setQueryData([this.AUTH_KEY], data);
                meAction.mutateLocal(data.user);
            },
            onError: errorHandler
        });

        const registerMutation = useMutation({
            mutationFn: (registerDto: RegisterDTO) => AuthApi.register(registerDto)
        });

        const logoutMutation = useMutation({
            mutationFn: AuthApi.logout,
            onSuccess: () => {},
            onSettled: AuthService.logout
        });

        const loginGoogleMutation = useMutation({
            mutationFn: (token: string) => AuthApi.loginGoogle(token),
            onSuccess: (data) => {
                // appRequest.updateTokenMapServer(data.accessToken);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("ACCESS_TOKEN", data.accessToken);
                queryClient.setQueryData([this.AUTH_KEY], data);
                meAction.mutateLocal(data.user);
            },
            onError: errorHandler
        });

        return {
            loginMutation,
            registerMutation,
            logoutMutation,
            verifyAuthMutation,
            loginGoogleMutation
        };
    };

    static getAuth = () => {
        if (typeof window === "undefined") return;
        const user = MeService.getLocalUser();
        const accessToken = localStorage.getItem("ACCESS_TOKEN");
        if (user && accessToken) {
            return { user, accessToken };
        } else return null;
    };

    static logout = () => {
        location.replace("/");
        localStorage.removeItem("user");
        localStorage.removeItem("ACCESS_TOKEN");
    };
}
