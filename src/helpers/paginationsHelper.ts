type IOptions = {
  page?: number;    
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}

type IOptionsResult = {
  page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
    // total: number;
    // totalPages: number;
}

 const calculatePagination = (options: IOptions): IOptionsResult => {
   const page: number = Number(options.page) || 1;
    const limit: number = Number(options.limit) || 10;
    const skip = Number((page - 1) * limit);
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    // const total = 0; 
    // const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
        // total,

        // totalPages
    }
}


export default calculatePagination;