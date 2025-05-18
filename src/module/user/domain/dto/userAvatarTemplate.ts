import { ISuccessResponse } from "@module/_core/infras/config/type/apiReponse";
import { EntityState } from "@module/_core/infras/config/type/entityState";
import { Pagination } from "@module/_core/infras/config/type/pagination";

export interface UserAvatarTemplateFilterDTO {
    // filter
    status?: EntityState;

    // pagination
    page?: number;
    pageSize?: number;
}

export interface UserAvatarTemplateDTO {
    id: number;
    name: string;
    url: string;
    status: EntityState;
    createdAt?: string;
}

export interface CreateUserAvatarTemplateDTO {
    name: string;
    status: EntityState;
}

export type GetUserAvatarTemplatesDTO = ISuccessResponse<{
    pagination: Pagination;
    userAvatarTemplateList: UserAvatarTemplateDTO[];
}>;
export type GetOneUserAvatarTemplateDTO = ISuccessResponse<{ avatar: UserAvatarTemplateDTO }>;

export interface UpdateUserAvatarTemplateDTO extends Partial<CreateUserAvatarTemplateDTO> {}
