import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import AuctionList from '../../components/elements/AuctionList/AuctionList';
import SearchInput from '../../components/elements/Search/Search';
import { ToastContainer } from 'react-toastify';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import getMyBoughtAuctionItems from './services/getMyAuctions';
import { useLocation } from 'react-router-dom';
import ItemList from './components/ItemList';

export default function MyBoughtAuctionItemsPage() {
  //const [boughtAuctionItems, setBoughtAuctionItems] = useState<any>([]);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page');
  const pageSize = searchParams.get('pageSize');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  

  const { isLoading, data } = useQuery(['auctionItems'], () => getMyBoughtAuctionItems(
    page,
    pageSize, 
    search,
    minPrice,
    maxPrice));

  return (
    <div className="div">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        
        <ItemList auctionItems={data.items} />
      )}
      <ToastContainer />
    </div>
  );
}
