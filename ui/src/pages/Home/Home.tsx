import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useQuery } from 'react-query';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import AuctionList from '../../components/elements/AuctionList/AuctionList';
import SearchInput from '../../components/elements/Search/Search';
import axios from 'axios';

const getAllAuctions = async (cursor : any) => {
  const url = `http://localhost:5167/api/auctions?pageSize=2&cursor=${cursor}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export default function Home() {
  const [auctionNextCursor, setAuctionNextCursor] = useAuctionNextCursor('');
  const [allAuctions, setAllAuctions] = useState<any>([]);

  const { isLoading, data } = useQuery(
    ['auctions', auctionNextCursor],
    () => getAllAuctions(auctionNextCursor),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        // Check if the new cursor is different from the current one
        if (newData.cursor !== auctionNextCursor) {
          setAllAuctions((prevAuctions: any) => {
            const updatedAuctions = [...prevAuctions, ...newData.auctions];
            console.log('Updated auctions:', updatedAuctions);
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
