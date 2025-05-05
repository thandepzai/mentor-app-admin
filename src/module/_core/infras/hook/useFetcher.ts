import { useQuery } from "@tanstack/react-query";

export interface IFetcherOptions<TData> {
    initialData?: TData | (() => TData);
    staleTime?: number;
    gcTime?: number;
    refetchOnMount?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    enabled?: boolean;
    placeholderData?: any;
    select?: (state: TData) => any;
    notifyOnChangeProps?: Array<"data" | "error" | "isPending" | "isFetching"> | "all";
    onError?: (err: unknown) => void;
}

export const useFetcher = <TData>(
    keys: any[],
    fetchFn: () => TData | Promise<TData>,
    options?: IFetcherOptions<TData>
) => {
    const { data, isPending, isFetching, isError, isSuccess, error, refetch } = useQuery<TData, unknown, TData>({
        queryKey: keys,
        queryFn: fetchFn,
        staleTime: 10000,
        gcTime: 300000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // change later
        retry: false,
        ...options
    });

    return {
        data,
        isPending,
        isFetching,
        isError,
        isSuccess,
        error,
        refetch
    };
};
