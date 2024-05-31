import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function AuctionItem({
  item,
  hubService,
  isCurrentlySelling,
  isSold,
  isCurrentUserTheHighestBidder,
  startTime
}: any) {
  const [bidAmount, setBidAmount] = useState<number | string>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left in seconds
  const sliderRef = useRef(null);

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

  useEffect(() => {
    if (isSold) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const [hours, minutes, seconds] = item.sellingPeriod.split(':').map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const remainingTime = totalSeconds - elapsed;


      if (remainingTime > totalSeconds){
        setTimeLeft(null); // Auction has not started yet
      } else if (remainingTime > 0) {
        setTimeLeft(remainingTime);
      } else if (isCurrentlySelling) {
        setTimeLeft(0); // Auction ended
      }

    };

    calculateTimeLeft();

    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [item.sellingPeriod, startTime, isSold, isCurrentlySelling]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) {
      return 'Not started';
    }

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBid = async () => {
    const numericBidAmount = typeof bidAmount === 'string' ? Number(bidAmount) : bidAmount;
    if (numericBidAmount > 0) {
      await hubService.sendBid(numericBidAmount, item.id);
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
        <p>Remaining time: {isSold ? '00:00:00' : formatTime(timeLeft)}</p>
        {isCurrentlySelling && !isSold && (
          <>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))}
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
