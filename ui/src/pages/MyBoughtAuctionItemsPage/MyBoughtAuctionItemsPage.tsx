import { useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterComponent from './components/FilterComponent';
import getMyBoughtAuctionItems from './services/getMyBoughtAuctionItems';
import ItemList from './components/ItemList';
import Pagination from '@mui/material/Pagination';

const PAGE = 1;
const PAGE_SIZE = 10;

export default function MyBoughtAuctionItemsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const [page, setPage] = useState(PAGE);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [hasNextPage, setHasNextPage] = useState(true);

  const handleChangePage = (event : any, newPage : any) => {
    setPage(newPage);
  };

  const applyFilters = (filters : any) => {
    const queryParams = new URLSearchParams();

    for (const key in filters) {
      if (filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    }

    navigate(`?${queryParams.toString()}`);
  };

  const { isLoading, data } = useQuery(
    ['auctionItems', page, pageSize, search, minPrice, maxPrice],
    () => getMyBoughtAuctionItems(page, pageSize, search, minPrice, maxPrice),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setHasNextPage(data.items.length > 0);
      }
    }
  );

  return (
    <div className="div flex flex-row justify-around">
      <FilterComponent
        className="basis-2/5"
        applyFilters={applyFilters}
        initialValues={{ search, minPrice, maxPrice }}
      />      
      {isLoading ? (
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
