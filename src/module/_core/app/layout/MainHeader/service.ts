import { useGlobalState } from "lib/hook/useGlobalState";
interface IHeaderState {
    title: string;
    linkBack?: string;
    onSearch?: (value: string) => void;
}

export class HeaderService {
    static HEADER_STATE_KEY = ["HEADER"];

    static initialHeaderState: IHeaderState = {
        title: "",
        linkBack: undefined,
        onSearch: undefined
    };

    static useHeader = <TData = IHeaderState>(select?: <T extends IHeaderState>(state: T) => TData) => {
        const { data, mutate, reset } = useGlobalState(HeaderService.HEADER_STATE_KEY, {
            initialData: HeaderService.initialHeaderState,
            notifyOnChangeProps: ["data"],
            select
        });

        const setHeaderTitle = (title: string, linkBack: string | undefined = undefined) => {
            reset();
            mutate((currentData: any) => ({
                ...currentData,
                title,
                linkBack
            }));
        };

        const setHeaderSearch = (onSearch: (value: string) => void) => {
            mutate((currentData: any) => ({
                ...currentData,
                onSearch
            }));
        };

        return {
            data: data as TData,
            setHeaderTitle,
            setHeaderSearch,
            setDefault: reset
        };
    };
}
