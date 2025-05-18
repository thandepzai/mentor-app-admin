import { useFetcher } from "module/_core/infras/hook/useFetcher";
import { ExtraDataApi } from "../api/extraData";
import { FilterExtraDataDto } from "../dto/extraData";

export class ExtraDataService {
    static EXTRA_DATA_KEY = "EXTRA_DATA";

    static useExtraData = (filter?: FilterExtraDataDto) => {
        const { data, isPending, isFetching, isError, error } = useFetcher(
            [this.EXTRA_DATA_KEY, filter],
            () => ExtraDataApi.getExtraData(filter),
            {
                staleTime: 180000,
                gcTime: 600000
            }
        );

        return {
            data,
            isPending,
            isFetching,
            isError,
            error
        };
    };
}
