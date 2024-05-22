export const applyFilters = (filters: any, navigate: any) => {
    const queryParams = new URLSearchParams();
  
    for (const key in filters) {
      if (filters[key] != '') {
        queryParams.append(key, filters[key]);
      }
    }

    navigate(`?${queryParams.toString()}`);
};