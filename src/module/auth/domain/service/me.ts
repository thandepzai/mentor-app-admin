import { UserApi } from "module/user/domain/api/user";
import { UpdateOneUserDTO, UserDTO } from "module/user/domain/dto/user";
import { useFetcher } from "module/_core/infras/hook/useFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MeApi } from "../api/me";

export class MeService {
    static ME_KEY = "ME";

    static getLocalUser = (): UserDTO | undefined => {
        const userString = localStorage.getItem("user");
        if (userString) return JSON.parse(userString) as UserDTO;
        return undefined;
    };

    static useMe = ({ enabled = true } = {}) => {
        const { data, isPending, isFetching, isError, error, refetch } = useFetcher([this.ME_KEY], MeApi.getMe, {
            enabled: enabled,
            staleTime: 120000,
            refetchOnWindowFocus: true,
            initialData: this.getLocalUser
        });

        return {
            data,
            me: data,
            isPending,
            isFetching,
            isError,
            error,
            refetch
        };
    };

    static useMeAction = () => {
        const queryClient = useQueryClient();

        const mutateLocal = (data?: any) => {
            return queryClient.setQueryData([this.ME_KEY], data ?? this.getLocalUser);
        };

        const updateMeMutation = useMutation({
            mutationFn: ({
                userId,
                updateOneUserDTO,
                avatarImage
            }: {
                userId: number;
                updateOneUserDTO: UpdateOneUserDTO;
                avatarImage: File;
            }) => UserApi.updateOneUser(userId, updateOneUserDTO, avatarImage),
            onSuccess: () => {
                queryClient.invalidateQueries();
            }
        });

        return {
            mutateLocal,
            updateMeMutation
        };
    };
}
