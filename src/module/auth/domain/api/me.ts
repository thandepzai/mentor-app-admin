import { appRequest } from "module/_core/infras/config/request/axios";
import { requester } from "module/_core/infras/config/request/requester";
import { AuthEndpoint } from "../../infras/config/endpointUrl";
import { GetMeDTO } from "../dto/me";
import { IMe } from "../model/me";

export class MeApi {
    static async getMe() {
        return requester<IMe>({
            requestFunc: () => appRequest.mapServer.get(AuthEndpoint.auth()),
            handleData: (data: GetMeDTO) => data.data.user
        })();
    }
}
