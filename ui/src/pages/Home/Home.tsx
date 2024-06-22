import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getAllAuctions from './services/getAllAuctions';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import AuctionFilterComponent from '../../components/elements/Auctions/AuctionFilterComponent';
import { applyFilters as applyFiltersUtil } from '../../components/utils/applyFilters';

export default function Home() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const nameStartsWith = searchParams.get('name.[sw]') || '';
  const descriptionContains = searchParams.get('description.[contains]') || '';
  const onlyActive = searchParams.get('onlyActive') || false;

  const [auctionNextCursor, setAuctionNextCursor] = useState('');
  const [allAuctions, setAllAuctions] = useState([]);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const applyFilters = (filters) => {
    applyFiltersUtil(filters, navigate);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const { auctions, cursor } = await getAllAuctions(
        '',
        pageSize,
        nameStartsWith,
        descriptionContains,
        onlyActive,
        t
      );
      setAllAuctions(auctions);
      setAuctionNextCursor(cursor);
      setIsLoading(false);
    };
    fetchInitialData();
  }, [pageSize, nameStartsWith, descriptionContains, onlyActive]);

  const handleMoreAuctions = async () => {
    if (isLoading || !auctionNextCursor) return;
    setIsLoading(true);
    const { auctions, cursor } = await getAllAuctions(
      auctionNextCursor,
      pageSize,
      nameStartsWith,
      descriptionContains,
      onlyActive,
      t
    );
    setAllAuctions((prevAuctions) => [...prevAuctions, ...auctions]);
    setAuctionNextCursor(cursor);
    setIsLoading(false);
  };

  return (
    <div className="div flex flex-row justify-around">
      <AuctionFilterComponent
        applyFilters={applyFilters}
        initialValues={{ nameStartsWith, descriptionContains, onlyActive }}

      />
        <InfiniteScroll
          dataLength={allAuctions.length}
          next={handleMoreAuctions}
          hasMore={!!auctionNextCursor}
          loader={<p>{t('loading')}</p>}
          endMessage={<p>{t('noMoreAuctions')}</p>}

        >
        <AuctionGroup auctions={allAuctions} />
      </InfiniteScroll>
      <ToastContainer />
    </div>
  );
}
