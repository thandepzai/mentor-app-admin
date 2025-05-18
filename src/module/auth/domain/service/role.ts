import { IFetcherOptions, useFetcher } from "module/_core/infras/hook/useFetcher";
import { RoleApi } from "../api/role";
import { IRole, IRoleDetail } from "../model/role";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateRoleDTO, UpdateRoleDTO } from "../dto/role";

interface UseRoleOptions {
    fetcherOptions?: IFetcherOptions<IRole[]>;
}

interface UseRoleDetailOptions {
    roleId: number;
    fetcherOptions?: IFetcherOptions<IRoleDetail>;
}

export class RoleService {
    static ROLE_KEY = "ROLES";

    static useRole = ({ fetcherOptions = {} }: UseRoleOptions = {}) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.ROLE_KEY],
            () => RoleApi.getRoles(),
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

    static useRoleDetail = ({ roleId, fetcherOptions = {} }: UseRoleDetailOptions) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.ROLE_KEY, roleId],
            () => RoleApi.getOneRole(roleId),
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

    static useRoleAction = () => {
        const queryClient = useQueryClient();

        const createRoleMutation = useMutation({
            mutationFn: (roleData: CreateRoleDTO) =>
                RoleApi.createRole({
                    body: roleData
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [RoleService.ROLE_KEY] });
            }
        });

        const updateRoleMutation = useMutation({
            mutationFn: ({ roleId, newRoleData }: { roleId: number; newRoleData: UpdateRoleDTO }) =>
                RoleApi.updateRole({
                    param: roleId,
                    body: newRoleData
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [RoleService.ROLE_KEY] });
            }
        });

        const deleteRoleMutation = useMutation({
            mutationFn: (roleId: number) => RoleApi.deleteRole({ param: roleId }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [RoleService.ROLE_KEY] });
            }
        });

        return {
            createRoleMutation,
            updateRoleMutation,
            deleteRoleMutation
        };
    };
}
