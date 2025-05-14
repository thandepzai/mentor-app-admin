import { AxiosResponse } from "axios";

class Exception extends Error {
    status: boolean;
    code: number;
    metaData: any;
    response: AxiosResponse | undefined;
    raw: Error | undefined;

    constructor(code = 100, message = "Unknown Error", metaData?: any, raw?: Error) {
        super(message);
        this.status = false;
        this.code = code;
        this.message = message;
        this.metaData = metaData;
        this.raw = raw;
    }
}

export default Exception;
