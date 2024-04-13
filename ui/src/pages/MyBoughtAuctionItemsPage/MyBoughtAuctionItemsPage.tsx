import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterComponent from './components/FilterComponent';
import getMyBoughtAuctionItems from './services/getMyBoughtAuctionItems';
import ItemList from './components/ItemList';
import Pagination from '@mui/material/Pagination';

export default function MyBoughtAuctionItemsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  const handleChangePage = (event : any, newPage : any) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event : any) => {
    setPageSize(parseInt(event.target.value, 10));
  };

  const applyFilters = (filters : any) => {
    const queryParams = new URLSearchParams();

    // Add non-empty filter parameters to the URL query string
    for (const key in filters) {
      if (filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    }

    // Update the URL with filter parameters
    navigate(`?${queryParams.toString()}`);
  };

  const { isLoading, data } = useQuery(
    ['auctionItems', page, pageSize, search, minPrice, maxPrice],
    () => getMyBoughtAuctionItems(page, pageSize, search, minPrice, maxPrice),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        // Check if there are any items on the next page
        setHasNextPage(data.items.length > 0);
      }
    }
  );

  return (
    <div className="div flex flex-row">
      <FilterComponent
        className="basis-2/5"
        applyFilters={applyFilters}
        initialValues={{ search, minPrice, maxPrice }} // Pass initial values to the filter component
      />      {isLoading ? (
        <div className="basis-3/5">Loading...</div>
      ) : data.totalCount === 0 ? (
        <div className="basis-3/5">No items found.</div>
      ) : (
        <div className="basis-3/5">
          <ItemList auctionItems={data.items} />
          <Pagination
            count={Math.ceil(data.totalCount / pageSize)}
            page={page}
            onChange={handleChangePage}
            siblingCount={1}
            boundaryCount={1}
            disabled={!hasNextPage}
          />
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
