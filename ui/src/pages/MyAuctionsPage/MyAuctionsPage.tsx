import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import AuctionList from '../Home/components/AuctionList/AuctionList';
import SearchInput from '../Home/components/Search/Search';
import { ToastContainer } from 'react-toastify';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import getTokenFromCookies from '../../components/utils/getTokenFromCookies';

const getMyAuctions = async (cursor : any) => {
  const token = getTokenFromCookies();
  const url = `http://localhost:5167/api/user/auctions?pageSize=2&cursor=${cursor}`;

  try {
    const response = await axios.get(url,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export default function MyAuctionsPage() {
  const [auctionNextCursor, setAuctionNextCursor] = useAuctionNextCursor('');
  const [allAuctions, setAllAuctions] = useState<any>([]);

  const { isLoading, data } = useQuery(
    ['auctions', auctionNextCursor],
    () => getMyAuctions(auctionNextCursor),
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
