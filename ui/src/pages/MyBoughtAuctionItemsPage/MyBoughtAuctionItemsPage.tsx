import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterComponent from './components/FilterComponent';
import getMyBoughtAuctionItems from './services/getMyBoughtAuctionItems';
import ItemList from './components/ItemList';

export default function MyBoughtAuctionItemsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page') == null ? 1 : searchParams.get('page');
  const pageSize = searchParams.get('pageSize') == null ? 10 : searchParams.get('pageSize');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const [filteredItems, setFilteredItems] = useState([]);

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
    { keepPreviousData: true } // Ensure previous data is kept while loading new data
  );

  return (
    <div className="div flex flex-row">
      <FilterComponent className="basis-2/5" applyFilters={applyFilters} />
      {isLoading ? (
        <div className="basis-3/5">Loading...</div>
      ) : (
        <ItemList className="basis-3/5" auctionItems={data.items} />
      )}
      <ToastContainer />
    </div>
  );
}
