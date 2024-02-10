import React, { useRef } from 'react';
import Slider from 'react-slick';
import AuctionItem from './AuctionItem'; // Ensure this is correctly imported
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Auction({ data, hubService }: any) {
  const sliderRef = useRef(null);

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
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">{data.name}</h1>

      <div className="flex justify-around p-5 w-full">
        <div className="w-4/6">
          <Slider ref={sliderRef} {...settings}>
            {data.auctionItems.map((item) => (
              <AuctionItem
                key={item.id}
                item={item}
                hubService={hubService}
                isCurrentlySelling={item.isSellingNow}
              />
            ))}
          </Slider>
        </div>
        <div className="w-48 ml-5 border shadow-md rounded ">
          <ul className="text-center">
            {data.auctionItems.map((item, index) => (
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
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Auction;
