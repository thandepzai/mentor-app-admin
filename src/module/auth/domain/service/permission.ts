import { IFetcherOptions, useFetcher } from "module/_core/infras/hook/useFetcher";
import { PermissionApi } from "../api/permission";
import { IPermission } from "../model/permission";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePermisisionDTO, UpdatePermisisionDTO } from "../dto/permission";

interface UsePermissionOptions {
    fetcherOptions?: IFetcherOptions<IPermission[]>;
}

export class PermissionService {
    static PERMISSION_KEY = "PERMISSIONS";

    static usePermission = ({ fetcherOptions = {} }: UsePermissionOptions = {}) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.PERMISSION_KEY],
            () => PermissionApi.getPermissions(),
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

    static usePermissionAction = () => {
        const queryClient = useQueryClient();

        const createPermissionMutation = useMutation({
            mutationFn: (permissionData: CreatePermisisionDTO) =>
                PermissionApi.createPermission({
                    body: permissionData
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PermissionService.PERMISSION_KEY] });
            }
        });

        const updatePermissionMutation = useMutation({
            mutationFn: ({
                permissionId,
                newPermissionData
            }: {
                permissionId: number;
                newPermissionData: UpdatePermisisionDTO;
            }) =>
                PermissionApi.updatePermission({
                    param: permissionId,
                    body: newPermissionData
                }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PermissionService.PERMISSION_KEY] });
            }
        });

        const deletePermissionMutation = useMutation({
            mutationFn: (permissionId: number) => PermissionApi.deletePermission({ param: permissionId }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: [PermissionService.PERMISSION_KEY] });
            }
        });

        return {
            createPermissionMutation,
            updatePermissionMutation,
            deletePermissionMutation
        };
    };
}
