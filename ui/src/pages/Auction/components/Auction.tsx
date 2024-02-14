import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import AuctionItem from './AuctionItem';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Auction({ data, hubService }: any) {
  const sliderRef = useRef(null);
  // Initialize auctionItems state with data.auctionItems
  const [auctionItems, setAuctionItems] = useState(data.auctionItems);

  useEffect(() => {
    const onItemSold = (soldItem) => {
      // Use a functional update to ensure we're always working with the most current state
      setAuctionItems((currentItems) =>
        currentItems.map((item) => {
          if (item.id === soldItem.auctionId) {
            // If the item matches the sold item, update its isSellingNow status
            return { ...item, isSellingNow: false };
          }
          // Otherwise, return the item unchanged
          return item;
        })
      );
    };

    // Subscribe to the ItemSold event
    hubService.onItemSold(onItemSold);

    // Cleanup function to unsubscribe from the ItemSold event
    return () => {
      hubService.offItemSold(onItemSold);
    };
  }, [hubService]); // Removed auctionItems from the dependency array

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

  const goToSlide = (index) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{data.name}</h1>

      <div className="flex justify-around p-5 w-full">
        <div className="w-4/6">
          <Slider ref={sliderRef} {...settings}>
            {auctionItems.map(
              (
                item // Use auctionItems from state, not data.auctionItems
              ) => (
                <AuctionItem
                  key={item.id}
                  item={item}
                  hubService={hubService}
                  isCurrentlySelling={item.isSellingNow}
                />
              )
            )}
          </Slider>
        </div>
        <div className="w-48 ml-5 border shadow-md rounded ">
          <ul className="text-center">
            {auctionItems.map(
              (
                item,
                index // Use auctionItems from state
              ) => (
                <li
                  key={item.id}
                  style={{
                    color: item.isSellingNow ? 'green' : 'black',
                    cursor: 'pointer',
                  }}
                  onClick={() => goToSlide(index)}
                >
                  {item.name}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Auction;
