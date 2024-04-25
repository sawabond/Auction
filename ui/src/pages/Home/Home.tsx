import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';

import getAllAuctions from './services/getAllAuctions';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import SearchInput from '../../components/elements/Search/Search';

export default function Home() {
  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState([]);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { auctions, cursor } = await getAllAuctions('', pageSize); // Initial limit
      setAllAuctions(auctions);
      setAuctionNextCursor(cursor);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [pageSize]); // Add pageSize as dependency

  const handleMoreAuctions = async () => {
    if (isLoading || !auctionNextCursor) return;
    setIsLoading(true);
    const { auctions, cursor } = await getAllAuctions(auctionNextCursor, pageSize); // Fetch next page with current cursor
    setAllAuctions(prevAuctions => [...prevAuctions, ...auctions]); // Append new auctions to existing auctions
    setAuctionNextCursor(cursor);
    setIsLoading(false);
  };

  return (
    <div>
      <SearchInput />
      <InfiniteScroll
        dataLength={allAuctions.length}
        next={handleMoreAuctions}
        hasMore={!!auctionNextCursor}
        loader={<p>Loading...</p>}
        endMessage={<p>No more auctions</p>}
      >
        <AuctionGroup auctions={allAuctions} />
      </InfiniteScroll>
      <ToastContainer />
    </div>
  );
}
