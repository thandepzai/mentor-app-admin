export enum ToastType {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFO = "info",
    DEFAULT = "default"
}

export interface ShowToastOptions {
    type?: ToastType;
    title?: string;
    description?: string;
}
