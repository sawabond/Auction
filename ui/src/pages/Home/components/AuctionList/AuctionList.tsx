import React from 'react';
import List from '@material-ui/core/List';
import AuctionItem from '../AuctionItem/AuctionItem';

function AuctionList({ auctions }: any) {
  return (
    <div className="mx-auto my-4">
      <List>
        {auctions.map((auction: any) => (
          <AuctionItem key={auction.id} auction={auction} />
        ))}
      </List>
    </div>
  );
}

export default AuctionList;
