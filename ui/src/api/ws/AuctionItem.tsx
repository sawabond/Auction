import React, { useState } from 'react';
import Bid from './Bid';
import { Card, CardContent, Typography, List, ListItem, Collapse, Button } from '@material-ui/core';

const AuctionItem: React.FC<any> = ({ item, isCurrentlySelling }) => {
  const [openBids, setOpenBids] = useState(false);
  const cardStyle = isCurrentlySelling ? { backgroundColor: 'lightgreen' } : {};

  const sortedBids = item.bids.slice().sort((a: any, b: any) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);


  return (
    <Card variant="outlined" style={{ margin: '20px 0', ...cardStyle }}>
      <CardContent>
        <Typography variant="h6" component="h2">
          {item.name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {item.description}
        </Typography>
        <Typography variant="body2">
          Starting Price: {item.startingPrice}
        </Typography>
        <Typography variant="body2">
          Actual Price: {item.actualPrice}
        </Typography>
        <Typography variant="body2">
          Minimal Bid: {item.minimalBid}
        </Typography>
        
        <Button 
          color="primary" 
          onClick={() => setOpenBids(!openBids)}
          style={{ marginTop: '10px' }}
        >
          {openBids ? 'Hide Bids' : 'Show Bids'}
        </Button>
        <Collapse in={openBids}>
          <List>
            {sortedBids.map((bid: any) => (
              <ListItem key={bid.id}>
                <Bid bid={bid} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default AuctionItem;
