import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { TextField, Button, Container } from '@material-ui/core';
import Auction from './components/Auction';

const AuctionMessaging: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [auction, setAuction] = useState<any>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_GATEWAY_URL!}/auction-hub`, {
        withCredentials: true,
        accessTokenFactory: () => Cookies.get('token')!,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('Connection started');
        await newConnection.invoke('JoinGroup', auctionId);
      } catch (err) {
        console.error('Connection failed: ', err);
      }
    };

    startConnection();

    return () => {
      newConnection.stop().then(() => console.log('Connection stopped'));
    };
  }, [auctionId]);

  useEffect(() => {
    console.log(auction);
    const updateBid = (bid: any) => {
      const updatedAuction = { ...auction };
      const itemIndex = updatedAuction.auctionItems.findIndex(
        (x: any) => x.isSellingNow
      );
      if (itemIndex !== -1) {
        updatedAuction.auctionItems[itemIndex] = {
          ...updatedAuction.auctionItems[itemIndex],
          actualPrice: bid.actualPrice,
        };
        setAuction(updatedAuction);
      }
    };

    if (connection) {
      connection.on('BidMade', updateBid);
    }

    return () => {
      if (connection) {
        connection.off('BidMade', updateBid);
      }
    };
  }, [connection, auction]);

  useEffect(() => {
    const handleAuctionUpdate = (updatedAuction: any) => {
      console.log('OnAuctionRunning event received:', updatedAuction);
      setAuction(updatedAuction);
    };

    if (connection) {
      console.log('Setting up OnAuctionRunning event listener');
      connection.on('OnAuctionRunning', handleAuctionUpdate);
    }

    return () => {
      if (connection) {
        console.log('Removing OnAuctionRunning event listener');
        connection.off('OnAuctionRunning', handleAuctionUpdate);
      }
    };
  }, [connection]);

  const sendMessage = async () => {
    if (connection) {
      try {
        await connection.invoke('MakeBid', auctionId, bidAmount);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <TextField
        label="Enter your bid"
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={sendMessage}
        style={{ marginBottom: '20px' }}
      >
        Send Bid
      </Button>
      {auction && <Auction data={auction} />}
    </Container>
  );
};

export default AuctionMessaging;
