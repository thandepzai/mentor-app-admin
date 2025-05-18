import { CreateApi, DeleteApi, UpdateApi } from "module/_core/infras/config/type/apiOptions";
import { AuthEndpoint } from "../../infras/config/endpointUrl";
import { CreatePermisisionDTO, GetPermissionsDTO, PermissionDTO, UpdatePermisisionDTO } from "../dto/permission";
import { sortActions } from "../utils/permission";
import { requester } from "@module/_core/infras/config/request";

export class PermissionApi {
    static async getPermissions() {
        return await requester.call<PermissionDTO[]>({
            boundedTime: 500,
            handleData: (data: GetPermissionsDTO) => {
                return data.data.permissions.map((ele) => ({
                    ...ele,
                    actions: sortActions(ele.actions)
                }));
            }
        })(AuthEndpoint.getPermissions());
    }

    static async createPermission({ body }: CreateApi<CreatePermisisionDTO>) {
        return await requester.call({
            requestFunc: () => requester.mapServerAxios.post(AuthEndpoint.createPermission(), body)
        })();
    }

    static async updatePermission({ param, body }: UpdateApi<UpdatePermisisionDTO>) {
        return await requester.call({
            requestFunc: () => requester.mapServerAxios.put(AuthEndpoint.updatePermission(param), body)
        })();
    }

    static async deletePermission({ param }: DeleteApi) {
        return await requester.call({
            requestFunc: () => requester.mapServerAxios.delete(AuthEndpoint.deletePermission(param))
        })();
    }
}
