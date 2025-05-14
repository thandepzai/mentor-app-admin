import RotateLogoLoading, { RotateLogoLoadingProps } from "lib/component/Loading/RotateLogoLoading";
import clsx from "clsx";

interface AppLoadingIconProps extends RotateLogoLoadingProps {
    title?: string;
    size?: number;
    titleClassName?: string;
    showTitle?: boolean;
}

interface AppLoadingViewProps extends AppLoadingIconProps {
    containerClassName?: string;
}

interface AppLoadingViewOverlayProps extends AppLoadingIconProps {
    containerClassName?: string;
    backDropClassName?: string;
}

export const AppLoadingIcon = ({
    title,
    titleClassName,
    showTitle = true,
    size,
    shadowOpacity
}: AppLoadingIconProps) => {
    return (
        <div>
            <RotateLogoLoading size={size} shadowOpacity={shadowOpacity} />
            {showTitle && (
                <div className={clsx("font-medium text-center text-lg text-[#588fc8] mt-2", titleClassName)}>
                    {title}
                </div>
            )}
        </div>
    );
};

export const AppLoadingView = (props: AppLoadingViewProps) => {
    return (
        <div
            className={clsx(
                "flex justify-center items-center bg-[rgba(255,255,255,0.8)] size-full visible opacity-100 duration-75",
                props.containerClassName
            )}
        >
            <AppLoadingIcon {...props} />
        </div>
    );
};

export const AppLoadingViewOverlay = (props: AppLoadingViewOverlayProps) => {
    return (
        <div className={clsx("absolute flex justify-center items-center inset-0 z-50", props.containerClassName)}>
            <div className={clsx("bg-[rgba(0,0,0,0.5)] absolute inset-0 z-0 ", props.backDropClassName)} />
            <div className="z-10">
                <AppLoadingIcon {...props} />
            </div>
        </div>
    );
};
