import { useRouter } from "next/router";

export interface RouterQuery {
    [key: string]: string;
}

// extract and process query params
export const useRouterQuery = (queryKeyList: string[]) => {
    const router = useRouter();
    const routerQuery: RouterQuery = {};

    queryKeyList.forEach((queryKey) => {
        const queryValue = router.query[queryKey];

        if (Array.isArray(queryValue)) {
            Object.defineProperty(routerQuery, queryKey, { value: queryValue[0] });
        } else if (typeof queryValue === "string") {
            Object.defineProperty(routerQuery, queryKey, { value: queryValue });
        } else return;
    });

    return routerQuery;
};
