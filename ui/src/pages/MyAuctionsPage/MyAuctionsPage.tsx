// Presentation Layer: MyAuctionsPage.jsx
import AuctionFilterComponent from '../../components/elements/Auctions/AuctionFilterComponent';
import AuctionGroup from '../../components/elements/Auctions/AuctionGroup';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useMyAuctions } from './hooks/useMyAuctions';

const URL = "/edit";

export default function MyAuctionsPage() {
  const searchParams = new URLSearchParams(location.search);

  // Extracting query parameters
  const nameStartsWith = searchParams.get('nameStartsWith') || '';
  const descriptionContains = searchParams.get('descriptionContains') || '';
  const onlyActive = searchParams.get('onlyActive') || false;
  const { currentAuctions, isLoading, currentPage, totalPages, applyFilters, handleChangePage } = useMyAuctions(location);

  return (
    <div className='div flex flex-row justify-around'>
      <AuctionFilterComponent 
        applyFilters={applyFilters}
        initialValues={{nameStartsWith, descriptionContains, onlyActive}}
        className='basis-2/5'
      />

      {isLoading ? (
        <div className="basis-3/5">Loading...</div>
      ) :  currentAuctions.length === 0 ? (
        <div className="basis-3/5">No auctions found.</div>
      ) : (
        <div className="basis-3/5">
          <AuctionGroup auctions={currentAuctions} url={URL} />
          <Stack spacing={2} direction="row" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
            />
          </Stack>
        </div>
      )}
    </div>
  );
}
