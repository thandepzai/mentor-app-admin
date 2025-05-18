import { IFetcherOptions, useFetcher } from "module/_core/infras/hook/useFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "../model/user";
import { UserApi } from "../api/user";
import { UserFilterDTO, CreateUserDTO, UpdateOneUserDTO } from "../dto/user";
import { Gender } from "../config/type/gender";
import { Pagination } from "module/_core/infras/config/type/pagination";

interface UseUserOptions {
    filter?: UserFilterDTO;
    fetcherOptions?: IFetcherOptions<{ pagination: Pagination; users: IUser[] }>;
}

interface UseUserDetailOptions {
    fetcherOptions?: IFetcherOptions<IUser>;
}

export class UserService {
    static USER_KEY = "USERS";

    static USER_AVATAR_HEIGHT = 256;
    static USER_AVATAR_ASPECT = 1 / 1;

    static genderMapName = {
        [Gender.MALE]: "Nam",
        [Gender.FEMALE]: "Nữ"
    };

    static useUser = ({ filter = {}, fetcherOptions = {} }: UseUserOptions = {}) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.USER_KEY, filter],
            () => UserApi.getUsers(filter),
            fetcherOptions
        );

        return {
            data,
            isPending,
            isFetching,
            isError,
            error
        };
    };

    static useUserDetail = (userId: number, { fetcherOptions = {} }: UseUserDetailOptions) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.USER_KEY, userId],
            () => UserApi.getOneUser(userId),
            fetcherOptions
        );

        return {
            data,
            isPending,
            isFetching,
            isError,
            error
        };
    };

    static useUserAction = () => {
        const queryClient = useQueryClient();

        const createUserMutation = useMutation({
            mutationFn: ({ createUserDTO, avatarImage }: { createUserDTO: CreateUserDTO; avatarImage?: File }) =>
                UserApi.createUser(createUserDTO, avatarImage),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_KEY] });
            }
        });

        const updateOneUserMutation = useMutation({
            mutationFn: ({
                userId,
                updateOneUserDTO,
                avatarImage
            }: {
                userId: number;
                updateOneUserDTO: UpdateOneUserDTO;
                avatarImage?: File;
            }) => UserApi.updateOneUser(userId, updateOneUserDTO, avatarImage),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_KEY] });
            }
        });

        const deleteOneUserMutation = useMutation({
            mutationFn: (userId: number) => UserApi.deleteOneUser(userId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_KEY] });
            }
        });

        return {
            createUserMutation,
            updateOneUserMutation,
            deleteOneUserMutation
        };
    };
}
