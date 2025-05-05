import { cleanObject } from "lib/util/functions";

const BASE_URL = process.env.roninHost;

export class MentorAppEndpoint {
    static base = BASE_URL;
    static baseAdmin = BASE_URL + "/admin";

    static extractQuery = (query: object) => {
        const queryString = Object.entries(cleanObject(query, [undefined, ""]))
            .map(([key, value]) => key + "=" + value)
            .join("&");

        return queryString;
    };
}
