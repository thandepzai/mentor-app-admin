import { Override } from "@tanstack/react-query";
import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
import { EntityState } from "module/_core/infras/config/type/entityState";
import { PermissionDTO } from "./permission";

export interface RolePermissionDTO {
    id: number;
    resource: string;
    resourceName: string;
    resourceId: number;
    action: string;
    actionName?: string;
    status: EntityState;
}

export interface RoleDTO {
    id: number;
    name: string;
    code: string;
    status: EntityState;
    defaultSignUp: boolean;
    permissions: RolePermissionDTO[];
}

export type RoleDetailDTO = Override<
    RoleDTO,
    { permissions: Pick<PermissionDTO, "resource" | "resourceName" | "actions">[] }
>;

// getRoles
export type GetRolesDTO = ISuccessResponse<{ roles: RoleDTO[] }>;

// getOneRole
export type GetOneRoleDTO = ISuccessResponse<{ role: RoleDTO }>;

// createRole
export interface CreateRoleDTO {
    status: EntityState;
    permissionIds: number[];
    name: string;
    code: string;
}

// updateRole
export interface UpdateRoleDTO {
    status: EntityState;
    permissionIds: number[];
    name: string;
}
