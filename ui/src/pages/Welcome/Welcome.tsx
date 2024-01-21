import React from 'react';
import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="h-screen w-full bg-welcome bg-no-repeat bg-cover bg-center flex flex-col justify-center">
      <div className="welcome relative flex flex-col justify-center items-center h-5/6">
        <div className="title mb-14">
          <p className="text-white text-center text-5xl not-italic font-extrabold uppercase underline-offset-2 underline">
            Auction <br /> online
          </p>
        </div>
        <div className="description mb-14">
          <p className="text-white text-center text-lg not-italic font-semibold">
            Welcome to the world of online <br /> auctions!
          </p>
        </div>
        <div className="register-link z-[1]">
          <Link
            to="/auth"
            className="uppercase border p-5 h-10 w-96 bg-white text-black flex items-center justify-center rounded-full font-bold"
          >
            Register now
          </Link>
        </div>
        <div className="shadow-overlay absolute inset-0 bg-white opacity-20 m-auto w-2/5 rounded-lg" />
      </div>
    </div>
  );
}
