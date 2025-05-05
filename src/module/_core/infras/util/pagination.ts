import { Pagination } from "module/_core/infras/config/type/pagination";

export const getRange = (pagination: Pagination | undefined) => {
    if (!pagination) return null;

    const { total, currentPage, pageSize } = pagination;
    if (total === 0) return "0 kết quả";
    const range = [pageSize * (currentPage - 1) + 1, pageSize * currentPage > total ? total : pageSize * currentPage];

    return `${range[0]}-${range[1]} của ${total} kết quả`;
};
