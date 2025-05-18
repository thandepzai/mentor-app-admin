import { ISuccessResponse } from "module/_core/infras/config/type/apiReponse";
import { EntityState } from "module/_core/infras/config/type/entityState";
import { Optional } from "lib/types/generics";

export interface PermissionActionDTO {
    id: number;
    action: string;
    actionName?: string;
    status: EntityState;
    resourceId?: number;
}

export interface PermissionDTO {
    id: number;
    resource: string;
    resourceName: string;
    actions: PermissionActionDTO[];
    status: EntityState;
    createdAt?: string;
    updatedAt?: string;
}

export type GetPermissionsDTO = ISuccessResponse<{ permissions: PermissionDTO[] }>;

export interface CreatePermisisionDTO {
    status: EntityState;
    resource: string;
    resourceName: string;
    actions: Omit<PermissionActionDTO, "id" | "resourceId">[];
}

export interface UpdatePermisisionDTO {
    status: EntityState;
    resourceName: string;
    actions: Optional<PermissionActionDTO, "id" | "resourceId">[];
}
