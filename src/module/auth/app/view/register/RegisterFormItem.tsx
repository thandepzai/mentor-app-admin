import { ChevronIcon } from "module/_core/app/icon/ChevronIcon";
import { EyeIcon } from "module/_core/app/icon/EyeIcon";
import { EyeSlashIcon } from "module/_core/app/icon/EyeSlashIcon";
import Dropdown from "lib/component/Dropdown";
import clsx from "clsx";
import { useState } from "react";
import { FieldError, Message, ControllerRenderProps } from "react-hook-form";

interface RegisterFormItemProps {
    label: string;
    placeholder?: string;
    type?: "password" | "select" | "selectWithSearch" | undefined;
    options?: {
        value: string | number;
        label: string;
    }[];
    required?: boolean;
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

const Input = ({ label, placeholder, field }: Pick<RegisterFormItemProps, "label" | "placeholder" | "field">) => {
    return (
        <input
            className="h-full grow rounded-lg bg-transparent px-4 placeholder:text-[#99AEBE]"
            placeholder={placeholder ?? label}
            id={field.name}
            {...field}
        />
    );
};

const PasswordInput = ({
    label,
    placeholder,
    field
}: Pick<RegisterFormItemProps, "label" | "placeholder" | "field">) => {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <>
            <input
                className="h-full grow rounded-lg bg-transparent pl-4 placeholder:text-[#99AEBE]"
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

const Select = ({
    label,
    placeholder,
    options,
    field: { onChange, value }
}: Pick<RegisterFormItemProps, "label" | "placeholder" | "options" | "field">) => {
    return (
        <div className="w-full">
            <Dropdown
                toggleComponent={
                    <div className="group flex h-11 w-full cursor-pointer items-center bg-transparent pl-4">
                        {value ? (
                            <span className="text-secondary-typo">
                                {options?.find((ele) => ele.value === value)?.label}
                            </span>
                        ) : (
                            <span className="text-[#99AEBE]">{placeholder ?? label}</span>
                        )}
                        <ChevronIcon className="absolute right-3 h-5 w-5 rotate-90 opacity-50 duration-150 group-hover:opacity-80" />
                    </div>
                }
                menuComponent={
                    <div className="max-h-60 w-full overflow-y-auto rounded-lg bg-white p-1 shadow-md">
                        {options?.map(({ value, label }) => (
                            <div
                                key={value}
                                className="flex h-9 w-full cursor-pointer items-center rounded-md px-3 duration-100 hover:bg-[rgba(0,0,0,0.06)]"
                                onClick={() => onChange(value)}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                }
                menuWrapperClassName="w-full!"
                blurOnClick={true}
            />
        </div>
    );
};

const SelectWithSearch = ({
    label,
    placeholder,
    options,
    field: { name, onChange, value }
}: Pick<RegisterFormItemProps, "label" | "placeholder" | "options" | "field">) => {
    const [isSearching, setIsSearching] = useState(false);
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="w-full">
            <Dropdown
                isOpen={isSearching}
                toggleComponent={
                    <div className="group flex h-11 w-full cursor-pointer items-center bg-transparent">
                        <input
                            className="z-10 h-full grow bg-transparent pl-4 pr-12 placeholder:text-[#99AEBE]"
                            autoComplete="off"
                            placeholder={value !== undefined ? "" : (placeholder ?? label)}
                            id={name}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => setIsSearching(true)}
                            onBlur={() => setTimeout(() => setIsSearching(false), 50)}
                        />
                        {inputValue === "" ? (
                            <span
                                className={`absolute left-4 duration-200 ${
                                    isSearching ? "text-[#99AEBE]" : "text-secondary-typo"
                                }`}
                            >
                                {options?.find((ele) => ele.value === value)?.label}
                            </span>
                        ) : null}
                        <ChevronIcon className="absolute right-3 h-5 w-5 rotate-90 opacity-50 duration-150 group-hover:opacity-80" />
                    </div>
                }
                menuComponent={
                    <div className="max-h-60 w-full overflow-y-auto rounded-lg bg-white p-1 shadow-md">
                        {options
                            ?.filter((ele) => ele.label.toLowerCase().includes(inputValue.toLowerCase()))
                            .map(({ value, label }) => (
                                <div
                                    key={value}
                                    className="flex h-9 w-full cursor-pointer items-center rounded-md px-3 duration-100 hover:bg-[rgba(0,0,0,0.06)]"
                                    onClick={() => {
                                        onChange(value);
                                        setTimeout(() => setInputValue(""), 100);
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        {!options?.filter((ele) => ele.label.toLowerCase().includes(inputValue.toLowerCase()))
                            .length ? (
                            <div className="py-3 text-center text-[#99AEBE]">Không có kết quả</div>
                        ) : null}
                    </div>
                }
                menuWrapperClassName="w-full!"
                blurOnClick={true}
            />
        </div>
    );
};

const RegisterFormItem = ({
    label,
    placeholder,
    type,
    required = false,
    options,
    error,
    field
}: RegisterFormItemProps) => {
    return (
        <div className="w-full text-sm">
            <div className="mb-1 flex items-end justify-between gap-4">
                <label htmlFor={field.name} className="relative w-fit shrink-0">
                    {label}
                    {required ? <span className="absolute -right-3 -top-1 text-md text-red-500">*</span> : null}
                </label>
                <div className="shrink text-right text-sm font-medium text-red-500">
                    {getErrorMessage(error, label)}
                </div>
            </div>
            <div
                className={clsx(
                    "flex h-11 w-full items-center rounded-lg border bg-[#F2F5F9] text-secondary-typo shadow-[0px_1px_1px_rgba(0,0,0,0.1)]",
                    error ? "border-red-400" : "border-transparent"
                )}
            >
                {type === undefined ? <Input label={label} placeholder={placeholder} field={field} /> : null}
                {type === "password" ? <PasswordInput label={label} placeholder={placeholder} field={field} /> : null}
                {type === "select" ? (
                    <Select label={label} placeholder={placeholder} options={options} field={field} />
                ) : null}
                {type === "selectWithSearch" ? (
                    <SelectWithSearch label={label} placeholder={placeholder} options={options} field={field} />
                ) : null}
            </div>
        </div>
    );
};

export default RegisterFormItem;
