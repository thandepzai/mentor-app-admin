export interface CreateApi<T> {
    body: T;
}

export interface UpdateApi<T> {
    param: number;
    body: T;
}

export interface DeleteApi {
    param: number;
}
