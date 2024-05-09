// Domain Layer: hooks/useMyAuctions.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import getMyAuctions from '../services/getMyAuctions';
import applyFilters from '../../../components/utils/applyFilters';

export const useMyAuctions = (location) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const nameStartsWith = searchParams.get('nameStartsWith') || "";
  const descriptionContains = searchParams.get('descriptionContains') || "";
  const onlyActive = searchParams.get('onlyActive') || false;
  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState([]);
  const [currentAuctions, setCurrentAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
 
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { auctions, cursor } = await getMyAuctions(
        '', 
        pageSize, 
        nameStartsWith, 
        descriptionContains, 
        onlyActive);
      setCurrentAuctions(auctions);
      setAllAuctions(auctions);
      setAuctionNextCursor(cursor);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [pageSize, nameStartsWith, descriptionContains, onlyActive]); 

  

  const handleNext = async () => {
    if (auctionNextCursor || currentPage * pageSize !== allAuctions.length) {
      setIsLoading(true);
      if(currentPage * pageSize === allAuctions.length)
      {
        const { auctions, cursor } = await getMyAuctions(
            auctionNextCursor, 
            pageSize, 
            nameStartsWith, 
            descriptionContains, 
            onlyActive
        );
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

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {

    if (page > currentPage)
      handleNext();
    else
      handlePrevious();
  }

  useEffect(() => {
    if (auctionNextCursor !== null)
        setTotalPages(Math.ceil(allAuctions.length / pageSize) + 1);
    else
        setTotalPages(Math.ceil(allAuctions.length / pageSize));
  }, [allAuctions, pageSize]);

  return {
    currentAuctions,
    isLoading,
    currentPage,
    totalPages,
    applyFilters,
    handleChangePage,
  };
};
