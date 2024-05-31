import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import AuctionItem from './AuctionItem';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useUserFromToken from '../../../hooks/useUserFromToken';

const START_TIME_WAITING = 10;

function Auction({ data, hubService }: any) {
  const sliderRef = useRef(null);
  const [auctionItems, setAuctionItems] = useState(data.auctionItems);
  const [currentSellingItem, setCurrentSellingItem] = useState(data.currentlySellingItem);
  const user = useUserFromToken();
  const settings = {
    dots: true,
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
    setAuctionItems(data.auctionItems);
    setCurrentSellingItem(data.currentlySellingItem);

    const currentlySellingIndex = data.auctionItems.findIndex(
      (item) => item.id === data.currentlySellingItem?.id
    );

    if (currentlySellingIndex !== -1) {
      sliderRef.current?.slickGoTo(currentlySellingIndex);
    }
  }, [data.auctionItems, data.currentlySellingItem]);

  useEffect(() => {
    const onBidUpdate = (updatedAuctionItem) => {
      setAuctionItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedAuctionItem.id ? updatedAuctionItem : item
        )
      );
    };
    if (hubService) {
      hubService.onBidMade(onBidUpdate);
    }
  }, [hubService]);

  const goToSlide = (index) => {
    sliderRef.current?.slickGoTo(index);
  };

  function getItemBackgroundClass(item, currentSellingItem, user) {
    const isCurrentUserTheHighestBidder =
      item.bids.length > 0 &&
      item.bids[item.bids.length - 1].userId === user.id;

    if (item.isSold) {
      return isCurrentUserTheHighestBidder ? 'text-yellow-400' : 'text-red-500';
    }

    if (item.id === currentSellingItem?.id) {
      return isCurrentUserTheHighestBidder
        ? 'text-yellow-400'
        : 'text-green-500';
    }

    return 'text-black-500';
  }

  const computeStartTime = (initialStartTime, cumulativeSellingPeriod) => {
    const initialDate = new Date(initialStartTime);
    const [hours, minutes, seconds] = cumulativeSellingPeriod.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    initialDate.setSeconds(initialDate.getSeconds() + totalSeconds);
    return initialDate.toISOString();
  };

  const getSellingPeriodInSeconds = (sellingPeriod) => {
    const [hours, minutes, seconds] = sellingPeriod.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{data.name}</h1>

      <div className="flex justify-around w-full">
        <div className="w-4/6">
          <Slider ref={sliderRef} {...settings}>
            {auctionItems.map((item, index) => {
              const cumulativeSellingPeriodSeconds = auctionItems
                .slice(0, index)
                .reduce((acc, curr) => acc + getSellingPeriodInSeconds(curr.sellingPeriod), 0);

              const itemStartTime = computeStartTime(data.startTime, `00:00:${cumulativeSellingPeriodSeconds}`);

              return (
                <AuctionItem
                  key={item.id}
                  item={item}
                  hubService={hubService}
                  isCurrentlySelling={item.id === currentSellingItem?.id}
                  isSold={item.isSold}
                  isCurrentUserTheHighestBidder={
                    item.bids.length > 0 &&
                    item.bids[item.bids.length - 1].userId === user.id
                  }
                  startTime={itemStartTime}
                />
              );
            })}
          </Slider>
        </div>
        <div className="w-48 ml-5 border shadow-md rounded">
          <ul className="text-center">
            {auctionItems.map((item, index) => (
              <li
                key={item.id}
                className={`cursor-pointer ${getItemBackgroundClass(item, currentSellingItem, user)}`}
                onClick={() => goToSlide(index)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Auction;
