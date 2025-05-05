import { delay } from "lib/util/functions";
import Exception from "lib/exception/Exception";
import { AxiosError } from "axios";
import { IFailResponse, IResponseData, ISuccessResponse } from "../type/apiReponse";
import { appRequest } from "./axios";

interface RequesterOptions<Model> {
    requestFunc?: (url: string) => Promise<{ data: IResponseData }>;
    boundedTime?: number;
    ignoreStatus?: boolean;
    handleData?: (data: ISuccessResponse) => Model;
}

// API REQUESTER
// requester(config)(url)
export const requester =
    <Model>({
        requestFunc = (url = "") => appRequest.mapServer.get(url),
        boundedTime = 0,
        ignoreStatus = false,
        handleData = (data: ISuccessResponse) => data as Model
    }: RequesterOptions<Model> = {}) =>
    async (url = "") => {
        const beforeTime = Date.now();
        try {
            const { data } = await requestFunc(url);

            if (Date.now() - beforeTime < 300) await delay(boundedTime);

            if (data?.status || ignoreStatus) return await handleData(data as ISuccessResponse);
            else {
                const { errorCode, message, metaData } = data as IFailResponse;
                throw new Exception(errorCode, message, metaData);
            }
        } catch (error) {
            if (Date.now() - beforeTime < 300) await delay(boundedTime);
            if (error instanceof AxiosError) {
                // console.log("ERROR", url, JSON.stringify(error.response?.data, null, 4));
                const data: IFailResponse = error.response?.data;
                if (data) throw new Exception(data.errorCode, data.message, data.metaData, error);
                else throw new Exception(error.response?.status, error.message, undefined, error);
            } else if (error instanceof Exception) {
                throw new Exception(error.code, error.message, error.metaData, error);
            } else throw error;
        }
    };

export const fetcher = requester({
    requestFunc: (url) => appRequest.mapServer.get(url),
    boundedTime: 200
});
