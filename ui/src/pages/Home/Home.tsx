import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';

import getAllAuctions from './services/getAllAuctions';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import AuctionFilterComponent from '../../components/elements/Auctions/AuctionFilterComponent';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('name.[sw]') || "";
  const description = searchParams.get('description.[contains]') || "";
  const onlyActive = searchParams.get('onlyActive');

  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState([]);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const applyFilters = (filters: any) => {
    const queryParams = new URLSearchParams();
  
    for (const key in filters) {
      if (filters[key] != '') {
        var param;
        switch (key) {
          case "search": {
            param = "name.[sw]";
            break;
          }
          case "description": {
            param = "description.[contains]";
            break;
          }
          default: {
            param = key;
            break;
          }
        }
        queryParams.append(param, filters[key]); // Use the derived param instead of key
      }
    }
  
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { auctions, cursor } = await getAllAuctions('', pageSize, search, description, onlyActive); // Initial limit
      setAllAuctions(auctions);
      setAuctionNextCursor(cursor);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [pageSize, search, description, onlyActive]); // Add search, description, and onlyActive as dependencies
  

  const handleMoreAuctions = async () => {
    if (isLoading || !auctionNextCursor) return;
    setIsLoading(true);
    const { auctions, cursor } = await getAllAuctions(auctionNextCursor, pageSize, search, description, onlyActive); // Fetch next page with current cursor
    setAllAuctions(prevAuctions => [...prevAuctions, ...auctions]); // Append new auctions to existing auctions
    setAuctionNextCursor(cursor);
    setIsLoading(false);
  };

  return (
    <div className='div flex flex-row justify-around'>
      <AuctionFilterComponent 
        applyFilters={applyFilters}
        initialValues={{ search, description, onlyActive }}
        className='basis-2/5'
      />
      <InfiniteScroll
        dataLength={allAuctions.length}
        next={handleMoreAuctions}
        hasMore={!!auctionNextCursor}
        loader={<p>Loading...</p>}
        endMessage={<p>No more auctions</p>}
        className='basis-3/5'
      >
        <AuctionGroup auctions={allAuctions} />
      </InfiniteScroll>
      <ToastContainer />
    </div>
  );
}
