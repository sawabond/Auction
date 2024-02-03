import React, { useState, useEffect } from 'react';

function AuctionItem({ item, isCurrentlySelling }: any) {
  const [timeLeft, setTimeLeft] = useState('');
  const [showBids, setShowBids] = useState(false); // State to toggle bid visibility

  useEffect(() => {
    if (item.isSellingNow) {
      const parts = item.sellingPeriod.split(':').map(Number);
      const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

      let remainingSeconds = totalSeconds;

      const countdown = setInterval(() => {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        remainingSeconds -= 1;

        if (remainingSeconds < 0) {
          clearInterval(countdown);
          setTimeLeft('Auction ended');
        }
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [item.isSellingNow, item.sellingPeriod]);

  const toggleBids = () => {
    setShowBids(!showBids);
  };

  return (
    <div
      className={`border p-4 m-2 rounded-lg ${
        item.isSellingNow ? 'bg-green-200' : 'bg-gray-200'
      }`}
    >
      <h2 className="text-lg font-bold">{item.name}</h2>
      <p>{item.description}</p>
      <p>Starting Price: {item.startingPrice}</p>
      <p>Actual Price: {item.actualPrice}</p>
      <p>Minimal Bid: {item.minimalBid}</p>
      {item.isSellingNow && (
        <p className="text-red-500">
          Time Left: {timeLeft || item.sellingPeriod}
        </p>
      )}

      <button
        onClick={toggleBids}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
      >
        {showBids ? 'Hide Bids' : 'Show Bids'}
      </button>

      {showBids && (
        <div className="mt-3">
          <ul>
            {item.bids.map((bid: any) => (
              <li key={bid.id} className="mt-2">
                Bidder: {bid.bidderName}, Amount: {bid.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AuctionItem;
