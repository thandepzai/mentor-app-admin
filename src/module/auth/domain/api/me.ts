import { GetOneUserDTO, UserDTO } from "module/user/domain/dto/user";
import { AuthEndpoint } from "../../infras/config/endpointUrl";
import { requester } from "@module/_core/infras/config/request";

export class MeApi {
    static async getMe() {
        return requester.call<UserDTO>({
            requestFunc: () => requester.mapServerAxios.get(AuthEndpoint.auth()),
            handleData: (data: GetOneUserDTO) => {
                return data.data.user;
            }
        })();
    }
}
