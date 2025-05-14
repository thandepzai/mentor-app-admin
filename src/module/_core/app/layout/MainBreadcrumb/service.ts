import { useGlobalState } from "lib/hook/useGlobalState";
interface ItemsBreadcrumb {
    title: string;
    href?: string;
}

interface IBreadcrumbState {
    items: ItemsBreadcrumb[];
}

export class BreadcrumbService {
    static BREADCRUMB_STATE_KEY = ["BREADCRUMB"];

    static initialBreadcrumbState: IBreadcrumbState = {
        items: []
    };

    static useBreadcrumb = <TData = IBreadcrumbState>(select?: <T extends IBreadcrumbState>(state: T) => TData) => {
        const { data, mutate, reset } = useGlobalState(BreadcrumbService.BREADCRUMB_STATE_KEY, {
            initialData: BreadcrumbService.initialBreadcrumbState,
            notifyOnChangeProps: ["data"],
            select
        });

        const setBreadcrumbItems = (items: ItemsBreadcrumb[]) => {
            mutate((currentData: any) => ({
                ...currentData,
                items
            }));
        };

        return {
            data: data as TData,
            setBreadcrumbItems,
            setDefault: reset
        };
    };
}
