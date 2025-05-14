import { IconProps } from "module/_core/app/config/type/icon";

export const InformationCircleIcon = ({
    type = "fill",
    className = "w-6 h-6",
    color = "var(--secondary)"
}: IconProps) => {
    if (type === "fill")
        return (
            <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    fill={color}
                ></path>
            </svg>
        );

    return null;
};
