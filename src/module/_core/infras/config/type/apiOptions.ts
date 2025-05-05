export interface CreateApi<T> {
    body: T;
}

export interface UpdateApi<T> {
    param: string;
    body: T;
}

export interface DeleteApi {
    param: string;
}
