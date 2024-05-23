// Domain Layer: hooks/useMyAuctions.js

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import getMyAuctions from '../services/getMyAuctions';
import { applyFilters as applyFiltersUtil } from '../../../components/utils/applyFilters';

export const useMyAuctions = (location) => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const nameStartsWith = searchParams.get('name.[sw]') || "";
  const descriptionContains = searchParams.get('description.[contains]') || "";
  const onlyActive = searchParams.get('onlyActive') || false;
  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState([]);
  const [currentAuctions, setCurrentAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const applyFilters = (filters) => {
    applyFiltersUtil(filters, navigate);
    setCurrentPage(1);
  };
 
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

  const handleNext = async (page) => {
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
        setCurrentAuctions(allAuctions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
      }
      setIsLoading(false);
    }
  };

  const handlePrevious = async (page) => {
    if (currentPage > 1) {
      setIsLoading(true);

      setCurrentAuctions(allAuctions.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
      setIsLoading(false);
    }
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {

    if (page > currentPage)
      handleNext(page);
    else if (page < currentPage)
      handlePrevious(page);
    setCurrentPage(page);
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
