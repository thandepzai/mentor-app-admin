import { IGlobalStateOptions, useGlobalState } from "lib/hook/useGlobalState";
import { useRef } from "react";

/*
    USAGE:

    -------------- DECLARES useCourseTabs to indentify group course tabs ----------
    const useCourseTabs = () => {
        const { setTab } = useTabs("COURSE", {
            notifyOnChangeProps: []
        });

        return { setTab };
    };


    -------------- DECLARE useCourseTab to track status of course tab --------------
    const useCourseTab = (name: string) => {
        return useTab("COURSE", name);
    };



    -------------- BUILD COMPONENT ----------------------------------
    const Page = () => {
        const {setTab} = useCourseTabs();

        return (
            <button onClick={() => setTab("chapters")/>
            ....
            <TabIntro name="intro">
            <TabChapter name="chapters">
            <TabComment name="comments">
            ...
        )

    }

    const TabIntro = (name) => {
        const {isActive, isTravel} = useCourseTab(name);
    }


*/

export interface ITabs {
    activeTab: string | null;
}

export const useTabs = (tabGroupKey: string, options?: Partial<IGlobalStateOptions<ITabs>>) => {
    const { data, mutate } = useGlobalState(["TABS", tabGroupKey], {
        initialData: {
            activeTab: null
        },
        ...options
    });

    const setTab = (tabName: string) => {
        mutate({
            activeTab: tabName
        });
    };

    return {
        activeTab: data.activeTab,
        setTab
    };
};

export const useTab = (tabGroupKey: string, tabName: string) => {
    const { activeTab } = useTabs(tabGroupKey);
    const isTraveled = useRef(false);
    const isActive = activeTab == tabName;

    if (isActive) isTraveled.current = true;

    return {
        isActive,
        isTraveled: isTraveled.current
    };
};
