import { useNavigate } from 'react-router-dom';

import List from '@material-ui/core/List';
import Auction from './Auction';

function AuctionGroup({ auctions, url = "" }: any) {
  const navigate = useNavigate();

  const handleClick = (auction: any) => {
    if (auction.endTime && url) {
      navigate(`/auctions/${auction.id}/items/sold`);
    }
    else {
      navigate(`/auctions/${auction.id}` + url);
    }
  };

  return (
    <div className="mx-auto my-4">
      <List className='flex flex-col gap-4'>
        {auctions.map((auction: any) => (
          <div key={auction.id} onClick={() => handleClick(auction)}>
            <Auction auction={auction} />
          </div>
        ))}
      </List>
    </div>
  );
}

export default AuctionGroup;
