import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button, TextField } from '@material-ui/core';

function AuctionItem({ item, hubService, isCurrentlySelling }: any) {
  const [bidAmount, setBidAmount] = useState(0);

  const sliderSettings = {
    infinite: false,
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: 1,
    speed: 500,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          centerMode: true,
          centerPadding: '0px',
          slidesToShow: 1,
        },
      },
    ],
  };

  const sliderRef = useRef(null);
  const handleBid = async () => {
    if (bidAmount > 0) {
      await hubService.sendBid(bidAmount, item.id); // Ensure sendBid method supports item id as a parameter
    }
  };
  return (
    <div
      className={`border p-4 rounded-lg ${
        isCurrentlySelling ? 'bg-green-200' : 'bg-gray-200'
      } m-5`}
    >
      <h2 className="text-lg font-bold">{item.name}</h2>
      <p>{item.description}</p>
      <p>Starting Price: {item.startingPrice}</p>
      <p>Actual Price: {item.actualPrice}</p>
      <p>Minimal Bid: {item.minimalBid}</p>
      <TextField
        label="Enter your bid"
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleBid} color="primary" variant="contained">
        Send Bid
      </Button>
      <div className="w-4/6">
        <Slider ref={sliderRef} {...sliderSettings}>
          {item.photos.map((photo, index) => (
            <div key={index} className="w-36">
              <img src={photo.photoUrl} alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default AuctionItem;
