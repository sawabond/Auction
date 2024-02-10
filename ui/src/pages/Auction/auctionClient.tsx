import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Container } from '@material-ui/core';
import Auction from './components/Auction';
import AuctionHubService from './AuctionHubService';

function AuctionMessaging() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [auction, setAuction] = useState(null);
  const [hubService, setHubService] = useState(null);

  useEffect(() => {
    if (auctionId) {
      const service = new AuctionHubService(auctionId, (update) =>
        setAuction(update)
      );
      service.onBidMade((bid) => {
        setAuction((prev) => {
          const updatedItems = prev.auctionItems.map((item) => {
            if (item.id === bid.auctionItemId) {
              return { ...item, actualPrice: bid.actualPrice };
            }
            return item;
          });
          return { ...prev, auctionItems: updatedItems };
        });
      });
      setHubService(service);

      return () => service.disconnect();
    }
  }, [auctionId]);

  return (
    <Container>
      {auction && <Auction data={auction} hubService={hubService} />}
    </Container>
  );
}

export default AuctionMessaging;
