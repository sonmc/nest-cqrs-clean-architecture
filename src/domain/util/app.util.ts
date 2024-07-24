export const getPagingFormat = (
  data: any,
  page: number,
  perPage: number,
  total: number,
) => {
  return {
    total,
    data,
    page,
    perPage,
  };
};

export const applyPaginationCursor = (data, limit = 10, page = 1) => {
  const startIndex = (page - 1) * limit ? 1 : (page - 1) * limit;
  const endIndex = page * limit;
  const result = {
    next: {},
    previous: {},
    items: {},
  };
  if (endIndex < data.length) {
    result.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (startIndex > 0) {
    result.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  result.items = data.slice(startIndex, startIndex + limit);
  return result;
};

export const applySearch = (search_key: string, field: string, datas: any) => {
  if (search_key && datas) {
    datas = datas.filter((x: any) =>
      x[field].toLowerCase().includes(search_key.toLowerCase()),
    );
  }
  return datas;
};

export const applySearchQuery = (
  search_key: string,
  searchField: string,
  query: any,
) => {
  if (search_key && searchField) {
    const keys = search_key.split(',');
    query.andWhere(`"${searchField}" IN (:...keys)`, { keys });
  }
};

export const applyPaginationQuery = (limit = 10, page = 0, query: any) => {
  const offset = page * limit;
  query.limit(limit).offset(offset);
};

export const applyPagination = (limit = 10, page = 1, datas: any) => {
  if (datas) {
    const offset = (page - 1) * limit;
    const paginatedData = datas.slice(offset, offset + limit);
    return paginatedData;
  }
};

export const applySortQuery = (
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  queryBuilder: any,
) => {
  if (sortBy && sortOrder) {
    if (sortBy.includes(',')) {
      const firstSortItem = sortBy.split(',')[0];
      queryBuilder.orderBy(`"${firstSortItem}"`, sortOrder.toUpperCase());
    } else {
      if (sortBy.includes('.')) {
        queryBuilder.orderBy(sortBy, sortOrder.toUpperCase());
      } else {
        queryBuilder.orderBy(`"${sortBy}"`, sortOrder.toUpperCase());
      }
    }
  }
};

export const applySort = (
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  datas: any,
) => {
  if (sortBy && sortOrder && datas && Array.isArray(datas)) {
    datas.sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === 0 || !aValue) return 1;
      if (bValue === 0 || !bValue) return -1;
      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });
  }
  return datas;
};

export const applyFilter = (keySearch: string, value: string, datas: any) => {
  const filteredData = datas.filter((data: any) => {
    if (data[keySearch] && typeof data[keySearch] === 'string') {
      return data[keySearch].toLowerCase().includes(value.toLowerCase());
    }
    return false;
  });
  return filteredData;
};
