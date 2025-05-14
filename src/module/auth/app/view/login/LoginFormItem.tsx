import { EyeIcon } from "module/_core/app/icon/EyeIcon";
import { EyeSlashIcon } from "module/_core/app/icon/EyeSlashIcon";
import clsx from "clsx";
import { useState } from "react";
import { FieldError, Message, ControllerRenderProps } from "react-hook-form";

interface LoginFormItemProps {
    label: string;
    placeholder?: string;
    type?: "password" | undefined;
    error?: FieldError;
    field: ControllerRenderProps<any, any>;
}

const getErrorMessage = (error: FieldError | undefined, label: string) => {
    if (!error) return null;

    let defaultMessage: string;
    switch (error?.type) {
        case "required":
            defaultMessage = `Vui lòng nhập ${label}`;
            break;
        default:
            defaultMessage = `${label} không hợp lệ`;
            break;
    }
    return error?.message ? (error?.message as Message) : defaultMessage;
};

const Input = ({ label, placeholder, field }: Pick<LoginFormItemProps, "label" | "placeholder" | "field">) => {
    return (
        <input
            className="px-4! h-full grow rounded-xl bg-transparent placeholder:text-[#99AEBE]"
            placeholder={placeholder ?? label}
            id={field.name}
            {...field}
        />
    );
};

const PasswordInput = ({ label, placeholder, field }: Pick<LoginFormItemProps, "label" | "placeholder" | "field">) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <>
            <input
                className="pl-4! h-full grow rounded-xl bg-transparent placeholder:text-[#99AEBE]"
                placeholder={placeholder ?? label}
                id={field.name}
                type={isRevealed ? undefined : "password"}
                {...field}
            />
            <div className="flex-center group h-full w-12 cursor-pointer" onClick={() => setIsRevealed(!isRevealed)}>
                {isRevealed ? (
                    <EyeSlashIcon className="h-4.5 w-4.5 opacity-50 duration-150 group-hover:opacity-80" />
                ) : (
                    <EyeIcon className="h-4.5 w-4.5 opacity-50 duration-150 group-hover:opacity-80" />
                )}
            </div>
        </>
    );
};

const LoginFormItem = ({ label, placeholder, type, error, field }: LoginFormItemProps) => {
    return (
        <div className="relative text-base">
            <div className="mb-1.5 flex items-end justify-between">
                <label htmlFor={field.name} className="relative w-fit">
                    {label}
                </label>
                <div className="w-2/3 text-right text-sm font-medium text-red-500">{getErrorMessage(error, label)}</div>
            </div>
            <div
                className={clsx(
                    "flex h-12 w-full items-center rounded-xl border bg-[#F2F5F9] text-secondary-typo shadow-[0px_1px_1px_rgba(0,0,0,0.1)]",
                    error ? "border-red-400" : "border-transparent"
                )}
            >
                {type === undefined ? <Input label={label} placeholder={placeholder} field={field} /> : null}
                {type === "password" ? <PasswordInput label={label} placeholder={placeholder} field={field} /> : null}
            </div>
        </div>
    );
};

export default LoginFormItem;
