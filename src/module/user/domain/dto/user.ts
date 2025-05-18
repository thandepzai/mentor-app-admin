import { PermissionAuth } from "module/auth/domain/config/type/authOption";
import { RoleDTO } from "module/auth/domain/dto/role";
import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
import { EntityState } from "module/_core/infras/config/type/entityState";
import { SortQuery } from "module/_core/infras/config/type/sortQuery";
import { Pagination } from "module/_core/infras/config/type/pagination";
import { Gender } from "../config/type/gender";

// Get users or get one user
export interface UserFilterDTO {
    // filter
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    yob?: number; // yearOfBirth
    cityId?: number;
    roleId?: number;
    status?: EntityState;

    // sorter
    sort?: SortQuery<"name" | "username" | "yob">;

    // pagination
    page?: number;
    pageSize?: number;
}

export interface UserDTO {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    gender: Gender;
    yearOfBirth: number;
    linkFacebook: string;
    avatar: string;
    avatarHash: string;
    city: {
        id: number;
        name: string;
        slug: string;
    };
    school: {
        id: number;
        name: string;
        cityId: number;
    };
    roles: Pick<RoleDTO, "name" | "code">[];
    permissions?: PermissionAuth[];
    status: EntityState;
    createdAt?: string;
    updatedAt?: string;
}

export type GetUsersDTO = ISuccessResponse<{ pagination: Pagination; users: UserDTO[] }>;
export type GetOneUserDTO = ISuccessResponse<{ user: UserDTO }>;

// Create
export interface CreateUserDTO {
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    gender?: Gender;
    yearOfBirth?: number;
    linkFacebook?: string;
    cityId?: number;
    schoolId?: number;
    roleIds?: number[];
    status?: EntityState;
    avatarHash?: string;
}

// Update
export interface UpdateOneUserDTO extends Partial<CreateUserDTO> {}
