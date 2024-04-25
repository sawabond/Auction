import React from 'react';
import { useNavigate } from 'react-router-dom';

import List from '@material-ui/core/List';
import Auction from './Auction';

function AuctionGroup({ auctions }: any) {
  const navigate = useNavigate();

  const handleClick = (auctionId: string) => {
    navigate(`/auctions/${auctionId}`);
  };

  return (
    <div className="mx-auto my-4">
      <List>
        {auctions.map((auction: any) => (
          <div key={auction.id} onClick={() => handleClick(auction.id)}>
            <Auction auction={auction} />
          </div>
        ))}
      </List>
    </div>
  );
}

export default AuctionGroup;
