import React from 'react';
import AuctionItem from './AuctionItem';
import { Typography, Paper, List, ListItem, Divider } from '@material-ui/core';

const Auction: React.FC<any> = ({ data }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      {/* Use Typography for text; Paper for cards/sections */}
      <Typography variant="h5" gutterBottom>
        Auction: {data.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Description: {data.description}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Start Time: {new Date(data.startTime).toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        End Time: {data.endTime ? new Date(data.endTime).toLocaleString() : 'Ongoing'}
      </Typography>
      <Divider style={{ margin: '20px 0' }} />
      <Typography variant="h6" gutterBottom>
        Auction Items:
      </Typography>
      <List>
        {data.auctionItems.map((item: any) => (
          <React.Fragment key={item.id}>
            <AuctionItem 
              item={item} 
              isCurrentlySelling={item.isSellingNow} // Pass the prop here
            />
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default Auction;
