import { IFetcherOptions, useFetcher } from "module/_core/infras/hook/useFetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAvatarTemplateApi } from "../api/useAvatarTemplate";
import {
    UserAvatarTemplateDTO,
    UserAvatarTemplateFilterDTO,
    CreateUserAvatarTemplateDTO,
    UpdateUserAvatarTemplateDTO
} from "../dto/userAvatarTemplate";
import { Pagination } from "module/_core/infras/config/type/pagination";

interface UseUserAvatarTemplateOptions {
    filter?: UserAvatarTemplateFilterDTO;
    fetcherOptions?: IFetcherOptions<{ pagination: Pagination; userAvatarTemplateList: UserAvatarTemplateDTO[] }>;
}

interface UseUserAvatarTemplateDetailOptions {
    fetcherOptions?: IFetcherOptions<UserAvatarTemplateDTO>;
}

export class UserAvatarTemplateService {
    static USER_AVATAR_TEMPLATE_KEY = "USER_AVATAR_TEMPLATES";

    static USER_AVATAR_TEMPLATE_HEIGHT = 256;
    static USER_AVATAR_TEMPLATE_ASPECT = 1 / 1;

    static useUserAvatarTemplate = ({ filter = {}, fetcherOptions = {} }: UseUserAvatarTemplateOptions = {}) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.USER_AVATAR_TEMPLATE_KEY, filter],
            () => UserAvatarTemplateApi.getUserAvatarTemplates(filter),
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

    static useUserAvatarTemplateDetail = (
        avatarId: number,
        { fetcherOptions = {} }: UseUserAvatarTemplateDetailOptions
    ) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.USER_AVATAR_TEMPLATE_KEY, avatarId],
            () => UserAvatarTemplateApi.getOneUserAvatarTemplate(avatarId),
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

    static useUserAvatarTemplateAction = () => {
        const queryClient = useQueryClient();

        const createUserAvatarTemplateMutation = useMutation({
            mutationFn: ({
                createUserAvatarTemplateDTO,
                template
            }: {
                createUserAvatarTemplateDTO: CreateUserAvatarTemplateDTO;
                template?: File;
            }) => UserAvatarTemplateApi.createUserAvatarTemplate(createUserAvatarTemplateDTO, template),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_AVATAR_TEMPLATE_KEY] });
            }
        });

        const updateUserAvatarTemplateMutation = useMutation({
            mutationFn: ({
                avatarId,
                updateUserAvatarTemplateDTO,
                template
            }: {
                avatarId: number;
                updateUserAvatarTemplateDTO: UpdateUserAvatarTemplateDTO;
                template?: File;
            }) => UserAvatarTemplateApi.updateUserAvatarTemplate(avatarId, updateUserAvatarTemplateDTO, template),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_AVATAR_TEMPLATE_KEY] });
            }
        });

        const deleteUserAvatarTemplateMutation = useMutation({
            mutationFn: (avatarId: number) => UserAvatarTemplateApi.deleteUserAvatarTemplate(avatarId),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [this.USER_AVATAR_TEMPLATE_KEY] });
            }
        });

        return {
            createUserAvatarTemplateMutation,
            updateUserAvatarTemplateMutation,
            deleteUserAvatarTemplateMutation
        };
    };
}
