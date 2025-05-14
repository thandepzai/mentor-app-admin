import { useEffect, useState } from "react";
import { IGlobalStateOptions, useGlobalState } from "./useGlobalState";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/*
    Usage:
    const { deviceType } = useWindowSize();

    Note: use useWindowSize(true) at root component (AppWrapper) to init adding event listener once !
    Note: Don't add to _app.tsx because bug of hydration can loose state
*/

type DeviceType = "mobile" | "tablet" | "laptop" | "desktop";
interface IWindowSize {
    deviceType: DeviceType;
    isInitOnClient: boolean;
}

const WINDOW_SIZE_KEY = ["WINDOW_SIZE_KEY"];

export const intialWindowSizeData: IWindowSize = {
    deviceType: "laptop",
    isInitOnClient: false
};

const useBaseWindowSize = (select?: (state: IWindowSize) => any) => {
    const { data, mutate } = useGlobalState<any>(WINDOW_SIZE_KEY, {
        initialData: intialWindowSizeData,
        ...(select && { select })
    });

    return {
        data,
        mutate
    };
};

export const useWindowSize = () => {
    const { data: deviceType } = useBaseWindowSize((state) => state.deviceType);

    return {
        deviceType: deviceType as DeviceType
    };
};

export const useInitWindownSize = () => {
    const { data: isInit, mutate } = useBaseWindowSize((state) => state.isInitOnClient);

    useIsomorphicLayoutEffect(() => {
        const getDeviceType = () => {
            if (window.innerWidth < 730) {
                return "mobile";
            } else if (window.innerWidth < 1080) {
                return "tablet";
            } else if (window.innerWidth < 1440) {
                return "laptop";
            } else {
                return "desktop";
            }
        };

        const handleResize = () => {
            requestAnimationFrame(() => {
                mutate((state: IWindowSize) => ({
                    ...state,
                    deviceType: getDeviceType()
                }));
            });
        };

        mutate({
            isInitOnClient: true,
            deviceType: getDeviceType()
        });

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return {
        isInit: isInit as boolean
    };
};
