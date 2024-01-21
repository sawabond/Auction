import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import Cookies from 'js-cookie';

// TODO: Use this logic as example for future SignalR interactions
const AuctionMessaging: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_GATEWAY_URL!}/auction-hub`, {
        withCredentials: true,
        accessTokenFactory: () => Cookies.get('token')!
      })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on('BidMade', (productId: string, newPrice: number) => {
        console.log(
          'Received from AuctionHub productId and newPrice:',
          productId,
          newPrice
        );
      });
    }
  }, [connection]);

  const sendMessage = async () => {
    if (connection) {
      try {
        await connection.start();

        await connection.invoke(
          'MakeBid',
          'd1541691-fe13-4b15-aa72-a10b25e50e8c',
          1.75
        );

        await connection.stop();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default AuctionMessaging;
