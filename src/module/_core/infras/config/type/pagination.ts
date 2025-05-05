export interface Pagination {
    total: number;
    currentPage: number;
    pageSize: number;
}

export interface PaginationFilter {
    pageSize: number;
    page: number;
}
