export const applyFilters = (filters: any, navigate: any) => {
    const queryParams = new URLSearchParams();
  
    for (const key in filters) {
      if (filters[key] != '') {
        switch(key){
          case "nameStartsWith":
            queryParams.append("name.[sw]", filters[key]);
            break;
          case "descriptionContains":
            queryParams.append("description.[contains]", filters[key]);
            break;
          default:
            queryParams.append(key, filters[key]);
            break;
        }
      }
    }

    navigate(`?${queryParams.toString()}`);
};