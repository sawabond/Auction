import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useQuery } from 'react-query';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import SearchInput from '../../components/elements/Search/Search';
import getAllAuctions from './services/getAllAuctions';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';

export default function Home() {
  const [auctionNextCursor, setAuctionNextCursor] = useAuctionNextCursor('');
  const [allAuctions, setAllAuctions] = useState<any>([]);
  const [pageSize] = useState(2);

  const { isLoading, data } = useQuery(
    ['auctions', auctionNextCursor],
    () => getAllAuctions(auctionNextCursor, pageSize),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        // Check if the new cursor is different from the current one
        if (newData.cursor !== auctionNextCursor) {
          setAllAuctions((prevAuctions: any) => {
            const updatedAuctions = [...prevAuctions, ...newData.auctions];
            return updatedAuctions;
          });
          setAuctionNextCursor(newData.cursor);
        }
      },
    }
  );

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
      isLoading ||
      !data?.cursor
    )
      return;
    setAuctionNextCursor(data.cursor);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [auctionNextCursor, isLoading, data]);

  return (
    <div className="div">
      <SearchInput />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AuctionGroup auctions={allAuctions} />
      )}
      {/**/}

      <ToastContainer />
    </div>
  );
}
