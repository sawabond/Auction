import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function AuctionItem({ auction }: any) {
  return (
    <ListItem key={auction.id} className="hover:bg-gray-100">
      <ListItemText primary={auction.name} secondary={auction.description} />
    </ListItem>
  );
}

export default AuctionItem;
