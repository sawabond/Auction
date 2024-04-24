import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import getAllAuctions from './services/getAllAuctions';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import SearchInput from '../../components/elements/Search/Search';

export default function Home() {
  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState<any>([]);
  const [pageSize] = useState(5);
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

  const handleLoadMore = async () => {
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
      {isLoading && <p>Loading...</p>}
      <AuctionGroup auctions={allAuctions} />
      {auctionNextCursor && <button onClick={handleLoadMore}>Load More</button>}
      <ToastContainer />
    </div>
  );
}

  // const { isLoading, data } = useQuery(
  //   ['auctions', auctionNextCursor],
  //   () => getAllAuctions(auctionNextCursor, pageSize),
  //   {
  //     keepPreviousData: true,
  //     onSuccess: (newData) => {
  //       // Check if the new cursor is different from the current one
  //       if (newData.cursor !== auctionNextCursor) {
  //         setAllAuctions((prevAuctions: any) => {
  //           const updatedAuctions = [...prevAuctions, ...newData.auctions];
  //           return updatedAuctions;
  //         });
  //         setAuctionNextCursor(newData.cursor);
  //       }
  //     },
  //   }
  // );

  // const handleScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
  //     isLoading ||
  //     !data?.cursor
  //   )
  //     return;
  //   setAuctionNextCursor(data.cursor);
  // };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [auctionNextCursor, isLoading, data]);

  // return (
  //   <div className="div">
  //     <SearchInput />
  //     {isLoading ? (
  //       <div>Loading...</div>
  //     ) : (
  //       <AuctionGroup auctions={allAuctions} />
  //     )}
  //     {/**/}

  //     <ToastContainer />
  //   </div>
  // );
//}
