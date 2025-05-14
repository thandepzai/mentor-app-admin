import { useFetcher } from "module/_core/infras/hook/useFetcher";
import { useQueryClient } from "@tanstack/react-query";
import { MeApi } from "../api/me";
import { Gender } from "../config/type/gender";
import { MeDTO } from "../dto/me";
import { AuthService } from "./auth";
import { useIsomorphicLayoutEffect } from "lib/hook/useIsomorphicLayoutEffect";

export class MeService {
    static ME_KEY = "ME";

    static genderMapName = {
        [Gender.MALE]: "Nam",
        [Gender.FEMALE]: "Nữ"
    };

    static useInitMe = () => {
        const meAction = this.useMeAction();
        useIsomorphicLayoutEffect(() => {
            meAction.mutateLocal();
        }, []);
    };

    static useMe = () => {
        const { isLogin } = AuthService.useAuth();
        const { data, isPending, isFetching, isError, error } = useFetcher([this.ME_KEY], MeApi.getMe, {
            enabled: !!isLogin,
            staleTime: 120000,
            gcTime: Infinity
        });

        return {
            data,
            isPending,
            isFetching,
            isError,
            error
        };
    };

    static useMeAction = () => {
        const queryClient = useQueryClient();

        const mutateLocal = (data?: any) => {
            return queryClient.setQueryData([this.ME_KEY], data ?? this.getLocalUser);
        };

        // const updateMeMutation = useMutation({
        //     mutationFn: ({
        //         userId,
        //         updateMeDTO,
        //         avatarImage
        //     }: {
        //         userId: string;
        //         updateMeDTO: UpdateMeDTO;
        //         avatarImage: File;
        //     }) => UserApi.updateOneUser(userId, updateOneUserDTO, avatarImage),
        //     onSuccess: () => {
        //         queryClient.invalidateQueries();
        //     }
        // });

        return {
            mutateLocal
            // updateMeMutation
        };
    };

    static getLocalUser = (): MeDTO | undefined => {
        if (typeof window === "undefined") return;
        const userString = localStorage.getItem("user");
        if (userString) return JSON.parse(userString) as MeDTO;
        return undefined;
    };
}
