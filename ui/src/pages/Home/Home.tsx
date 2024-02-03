import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuctionMessaging from '../Auction/auctionClient';

export default function Home() {
  return (
    <>
      <AuctionMessaging />
      <div className="div">
        <h1 className="uppercase text-emerald-600">Home</h1>
        <ToastContainer />
      </div>
    </>
  );
}
