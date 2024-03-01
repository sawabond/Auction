import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function AuctionItem({
  item,
  hubService,
  isCurrentlySelling,
  isSold,
  isCurrentUserTheHighestBidder,
}: any) {
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
      await hubService.sendBid(bidAmount, item.id);
    }
  };
  function determineBgColor({
    isSold,
    isCurrentUserTheHighestBidder,
    isCurrentlySelling,
  }) {
    if (isCurrentlySelling) {
      return isCurrentUserTheHighestBidder ? 'bg-yellow-400' : 'bg-green-200';
    }

    if (isSold) {
      return isCurrentUserTheHighestBidder ? 'bg-yellow-400' : 'bg-red-200';
    }

    return 'bg-gray-200';
  }

  return (
    <div
      className={`flex justify-around items-center m-5 border p-4 rounded-lg ${determineBgColor({ isSold, isCurrentUserTheHighestBidder, isCurrentlySelling })} space-x-4`}
    >
      <div className="w-full md:w-1/2 ml-2.5">
        <Slider ref={sliderRef} {...sliderSettings}>
          {item.photos.map((photo, index) => (
            <div
              key={index}
              className="flex justify-center items-center overflow-hidden"
            >
              <img
                src={photo.photoUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-300" // Image fills width, maintains aspect ratio
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="w-full md:w-1/2 p-4 rounded-lg">
        <h2 className="text-lg font-bold">{item.name}</h2>
        <p>{item.description}</p>
        <p>Starting Price: {item.startingPrice}</p>
        <p>Actual Price: {item.actualPrice}</p>
        <p>Minimal Bid: {item.minimalBid}</p>
        {isCurrentlySelling && (
          <>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your bid"
            />
            <button
              onClick={handleBid}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Send Bid
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuctionItem;
