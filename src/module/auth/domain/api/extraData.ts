import { requester } from "@module/_core/infras/config/request";
import { AuthEndpoint } from "../../infras/config/endpointUrl";
import { ExtraDataDto, FilterExtraDataDto, GetExtraDataDTO } from "../dto/extraData";

export class ExtraDataApi {
    static async getExtraData(filter?: FilterExtraDataDto) {
        return await requester.call<ExtraDataDto>({
            requestFunc: () => requester.mapServerAxios.post(AuthEndpoint.getExtraData(), filter),
            handleData: (data: GetExtraDataDTO) => {
                return data.data;
            }
        })();
    }
}
