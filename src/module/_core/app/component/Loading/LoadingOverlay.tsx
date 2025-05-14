import { memo, useState } from "react";
import { AppLoadingViewOverlay } from "./AppLoading";

interface ILoadingOverlayState {
    title: string;
    titleClassName: string;
    loading: boolean;
}

const LoadingOverlay = () => {
    const [loadingState, setLoadingState] = useState<ILoadingOverlayState>({
        loading: false,
        title: "Đang tải...",
        titleClassName: "text-white"
    });

    const openLoadingOverlay = (data: Omit<ILoadingOverlayState, "loading">) => {
        setLoadingState({
            ...data,
            loading: true
        });
    };

    const closeLoadingOverlay = () => {
        setLoadingState((prev) => ({
            ...prev,
            loading: false
        }));
    };

    LoadingOverlayManager.openLoadingOverlay = openLoadingOverlay;

    LoadingOverlayManager.closeLoadingOverlay = closeLoadingOverlay;

    return (
        <div
            className="fixed inset-0 z-50"
            style={{
                visibility: loadingState.loading ? "visible" : "hidden",
                opacity: loadingState.loading ? 1 : 0,
                transition: "0.15s ease-in-out"
            }}
        >
            <AppLoadingViewOverlay title={loadingState.title} titleClassName={loadingState.titleClassName} />
        </div>
    );
};

export default memo(LoadingOverlay);

const LoadingOverlayManager = {} as { openLoadingOverlay: any; closeLoadingOverlay: any };

export const openLoadingOverlay = (title?: string, titleClassName = "text-white") => {
    LoadingOverlayManager.openLoadingOverlay && LoadingOverlayManager.openLoadingOverlay({ title, titleClassName });
};

export const closeLoadingOverlay = () => {
    LoadingOverlayManager.closeLoadingOverlay && LoadingOverlayManager.closeLoadingOverlay();
};
