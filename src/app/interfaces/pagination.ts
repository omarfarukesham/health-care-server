export type IPaginationOptions = {
    page?: number;
    limit?: number;
    total?: number;
    sortOder?: string | undefined;
    sortBy?: string | undefined
    searchTerm?: string | undefined;
    filter?: string | undefined;
    skip?: number | undefined;
}