export interface QueryOptions {
    sort?: string;
    page?: string;
    limit?: string;
    filter?: {
        [key: string]: string;
    };
}
