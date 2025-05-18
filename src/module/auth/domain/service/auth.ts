import { useFetcher } from "module/_core/infras/hook/useFetcher";
import { errorHandler } from "module/_core/infras/util/exceptionHandler";
import { isOnServer } from "module/_core/infras/util/isOnServer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "../api/auth";
import { MeApi } from "../api/me";
import { PermissionAuth } from "../config/type/authOption";
import { LoginDTO } from "../dto/auth";
import { IMe } from "../model/me";
import { MeService } from "./me";

export interface IAuth {
    user: IMe;
    accessToken: string;
}

export class AuthService {
    static AUTH_KEY = "AUTH_KEY";

    static useAuth = (select?: (state: IAuth | undefined) => any) => {
        const { data, refetch } = useFetcher([this.AUTH_KEY], this.getAuth, {
            initialData: this.getAuth,
            notifyOnChangeProps: ["data", "isPending"],
            select
        });

        // Verify Access Control By Resource
        const verifyACR = (...resources: string[]) => {
            return resources.some((resouce) =>
                data?.user?.permissions?.some((userPermission) => resouce == userPermission.resource)
            );
        };

        // Verify Access Control By Permission
        const verifyACP = (...permissions: PermissionAuth[]) => {
            return permissions.some((permission) =>
                data?.user?.permissions?.some(
                    (userPermission) =>
                        permission.resource == userPermission.resource && permission.action == userPermission.action
                )
            );
        };

        const verifyRBAC = (...roles: string[]) => {
            return roles.some((role) => data?.user?.roles?.some((userRole) => role == userRole.code));
        };

        return {
            user: data?.user,
            isLogin: !!data?.user,
            verifyACP,
            verifyACR,
            verifyRBAC,
            refetch
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
            onError: (error) => {
                console.log("ERRROR", error);
            }
        });

        const logoutMutation = useMutation({
            mutationFn: AuthApi.logout,
            onSuccess: () => {},
            onSettled: AuthService.logout
        });

        return {
            loginMutation,
            logoutMutation,
            verifyAuthMutation
        };
    };

    static getAuth = () => {
        if (isOnServer) return;
        const user = MeService.getLocalUser();
        const accessToken = this.getLocalAccessToken();
        if (user && accessToken) {
            return { user, accessToken };
        } else return undefined;
    };

    static logout = () => {
        location.replace("/");
        localStorage.removeItem("user");
        localStorage.removeItem("ACCESS_TOKEN");
    };

    static getLocalAccessToken = () => {
        return localStorage.getItem("ACCESS_TOKEN");
    };
}
