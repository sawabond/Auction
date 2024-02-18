import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import AuctionItem from './AuctionItem';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import useUserFromToken from '../../../hooks/useUserFromToken';

function Auction({ data, hubService }: any) {
  const sliderRef = useRef(null);
  const [auctionItems, setAuctionItems] = useState(data.auctionItems);
  const [currentSellingItem, setCurrentSellingItem] = useState(
    data.currentlySellingItem
  );
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

  const goToSlide = (index) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{data.name}</h1>

      <div className="flex justify-around w-full">
        <div className="w-4/6">
          <Slider ref={sliderRef} {...settings}>
            {auctionItems.map((item) => (
              <AuctionItem
                key={item.id}
                item={item}
                hubService={hubService}
                isCurrentlySelling={item.id === currentSellingItem?.id}
                isSold={item.isSold}
                isCurrentUserTheBuyer={item.userId === user.id}
              />
            ))}
          </Slider>
        </div>
        <div className="w-48 ml-5 border shadow-md rounded">
          <ul className="text-center">
            {auctionItems.map((item, index) => (
              <li
                key={item.id}
                className={`cursor-pointer ${
                  item.id === currentSellingItem?.id
                    ? 'text-green-500'
                    : item.isSold
                      ? 'text-red-500'
                      : item.userId === user.id
                        ? 'text-gold-500'
                        : 'text-black'
                }`}
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
