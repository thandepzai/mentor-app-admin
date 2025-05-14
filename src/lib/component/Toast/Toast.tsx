import { CloseCircleIcon } from "module/_core/app/icon/CloseCircleIcon";
import { ExclamationCircleIcon } from "module/_core/app/icon/ExclamationCircleIcon";
import { InformationCircleIcon } from "module/_core/app/icon/InformationCircleIcon";
import { TickCircleIcon } from "module/_core/app/icon/TickCircleIcon";
import { ToastContainer, toast } from "react-toastify";
import { ShowToastOptions, ToastType } from "./type";

const contextClass = {
    [ToastType.SUCCESS]: {
        bg: "bg-white",
        title: "text-green-400",
        progress: "bg-green-400",
        color: "#4ade80",
        Icon: TickCircleIcon
    },
    [ToastType.ERROR]: {
        bg: "bg-white",
        title: "text-red-400",
        progress: "bg-red-400",
        color: "#f87171",
        Icon: CloseCircleIcon
    },
    [ToastType.WARNING]: {
        bg: "bg-white",
        title: "text-orange-400",
        progress: "bg-orange-400",
        color: "#fb923c",
        Icon: ExclamationCircleIcon
    },
    [ToastType.INFO]: {
        bg: "bg-white",
        title: "text-blue-400",
        progress: "bg-blue-400",
        color: "#60a5fa",
        Icon: InformationCircleIcon
    },
    [ToastType.DEFAULT]: {
        bg: "bg-white",
        title: "text-blue-400",
        progress: "bg-blue-400",
        color: "#60a5fa",
        Icon: InformationCircleIcon
    }
};

const CloseButton = () => (
    <button className="Toastify__close-button" type="button" aria-label="close">
        <svg aria-hidden="true" viewBox="0 0 14 16">
            <path
                fillRule="evenodd"
                d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"
            ></path>
        </svg>
    </button>
);

const Msg = ({ title = "Thông báo", description = "Mô tả", type }: ShowToastOptions) => {
    const context = contextClass[type ?? ToastType.DEFAULT];

    return (
        <div className={`${context.bg} p-6`}>
            <div className="flex">
                <div className="pr-2">
                    <context.Icon className="h-6 w-6" color={context.color} type="fill" />
                </div>
                <div>
                    <p className={`${context.title} flex font-bold`}>{title}</p>
                    <p className="py-1 text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    );
};

export const showToast = ({ type, title, description }: ShowToastOptions) => {
    toast(<Msg title={title} description={description} type={type} />, { type: type });
};

export const Toast = () => {
    return (
        <ToastContainer
            position="bottom-left"
            icon={false}
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggablePercent={50}
            pauseOnHover
            closeButton={CloseButton}
            progressClassName={({ type, defaultClassName }: any) => {
                return `${defaultClassName} ${contextClass[type ?? ToastType.DEFAULT].progress}`;
            }}
        />
    );
};
