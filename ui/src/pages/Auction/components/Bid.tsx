import React from 'react';

const Bid: React.FC<any> = ({ bid }) => {
  return (
    <div>
      <p>Bid Amount: {bid.amount}</p>
      <p>Date: {bid.date}</p>
      <p>Actual Price: {bid.actualPrice}</p>
    </div>
  );
};

export default Bid;
