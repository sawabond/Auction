import React, { useEffect, useState } from 'react';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import { ToastContainer } from 'react-toastify';
import useAuctionNextCursor from '../../hooks/useAuctionNextCursor';
import getMyAuctions from './services/getMyAuctions';
import { useLocation, useNavigate } from 'react-router-dom';
import AuctionFilterComponent from '../../components/elements/Auctions/AuctionFilterComponent';
import Pagination from '@mui/material/Pagination';

const URL = "/edit";

export default function MyAuctionsPage() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const nameStartsWith = searchParams.get('nameStartsWith') || "";
  const descriptionContains = searchParams.get('descriptionContains') || "";
  const onlyActive = searchParams.get('onlyActive') || false;

  const [auctionNextCursor, setAuctionNextCursor] = useAuctionNextCursor('');
  const [currentAuctions, setCurrentAuctions] = useState<any>([]);
  const [allAuctions, setAllAuctions] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  const applyFilters = (filters: any) => {
    const queryParams = new URLSearchParams();
  
    for (const key in filters) {
      if (filters[key] != '') {
        queryParams.append(key, filters[key]);
      }
    }
  
    navigate(`?${queryParams.toString()}`);
  };
 
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { auctions, cursor } = await getMyAuctions('', pageSize, nameStartsWith, descriptionContains, onlyActive);
      setCurrentAuctions(auctions);
      setAllAuctions(auctions);
      setAuctionNextCursor(cursor);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [pageSize, nameStartsWith, descriptionContains, onlyActive]); 

  

  const handleNext = async () => {
    if (auctionNextCursor || currentPage * pageSize != allAuctions.length) {
      setIsLoading(true);
      if(currentPage * pageSize == allAuctions.length)
      {
        const { auctions, cursor } = await getMyAuctions(auctionNextCursor, pageSize, nameStartsWith, descriptionContains, onlyActive);
        setAllAuctions([...allAuctions, ...auctions]);
        setCurrentAuctions(auctions);
        setAuctionNextCursor(cursor);
      }
      else
      {
        setCurrentAuctions(allAuctions.slice(currentPage * pageSize, currentPage * pageSize + pageSize));
      }
      setIsLoading(false);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevious = async () => {
    if (currentPage > 1) {
      setIsLoading(true);

      setCurrentAuctions(allAuctions.slice((currentPage - 2) * pageSize, (currentPage - 2) * pageSize + pageSize));
      setIsLoading(false);
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className='div flex flex-row justify-around'>
      <AuctionFilterComponent 
        applyFilters={applyFilters}
        initialValues={{ nameStartsWith, descriptionContains, onlyActive }}
        className='basis-2/5'
      />

      {isLoading ? (
        <div className="basis-3/5">Loading...</div>
      ) : currentAuctions.length === 0 ? (
        <div className="basis-3/5">No auctions found.</div>
      ) : (
        <div className="basis-3/5">
          <AuctionGroup auctions={currentAuctions} url={URL} />
          <div>
            <button onClick={handlePrevious} disabled={currentPage === 1}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
