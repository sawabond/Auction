import { useState } from 'react';
import { useQuery } from 'react-query';
import AuctionList from '../../components/elements/AuctionList/AuctionList';
import SearchInput from '../../components/elements/Search/Search';
import { ToastContainer } from 'react-toastify';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import getMyAuctions from './services/getMyAuctions';



export default function MyAuctionsPage() {
  const [auctionNextCursor, setAuctionNextCursor] = useAuctionNextCursor('');
  const [allAuctions, setAllAuctions] = useState<any>([]);
  const [pageSize] = useState(2);

  const { isLoading, data } = useQuery(
    ['auctions', auctionNextCursor],
    () => getMyAuctions(auctionNextCursor, pageSize),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        // Check if the new cursor is different from the current one
        if (newData.cursor !== auctionNextCursor) {
          setAllAuctions((prevAuctions: any) => {
            const updatedAuctions = [...prevAuctions, ...newData.auctions];
            //console.log('Updated auctions:', updatedAuctions);
            return updatedAuctions;
          });
          setAuctionNextCursor(newData.cursor);
        }
      },
    }
  );

  const handleLoadMore = () => {
    if (data?.cursor) {
      setAuctionNextCursor(data.cursor);
    }
  };

  return (
    <div className="div">
      <SearchInput />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AuctionList auctions={allAuctions} />
      )}

      {data?.cursor && (
        <button type="submit" onClick={handleLoadMore}>
          Load More
        </button>
      )}
      <ToastContainer />
    </div>
  );
}
