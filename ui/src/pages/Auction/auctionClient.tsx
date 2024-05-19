import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { toast } from 'react-toastify';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Auction from './components/Auction';
import AuctionHubService from './AuctionHubService';
import { useQueryClient } from 'react-query';
import useUserFromToken from '../../hooks/useUserFromToken';

function AuctionMessaging() {
  const user = useUserFromToken();
  const { auctionId } = useParams<{ auctionId: string }>();
  const [auction, setAuction] = useState<any>(null);
  const [hubService, setHubService] = useState<any>(null); // Ensure hubService is part of the state
  const [isAuctionStarted, setIsAuctionStarted] = useState(false);
  const [isAuctionClosed, setIsAuctionClosed] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!auctionId) return;

    const service = new AuctionHubService(
      auctionId,
      (update) => {
        setAuction(update);

        const startTime = new Date(update.startTime).getTime();
        const currentTime = new Date().getTime();
        setIsAuctionStarted(startTime <= currentTime);
      },
      (itemSold) => {
        setAuction((prev: any) => {
          if (!prev) return prev;

          const updatedItems = prev.auctionItems.map((item: any) =>
            item.id === itemSold.id
              ? { ...item, isSold: true, userId: itemSold.userId }
              : item
          );

          if (itemSold.userId == user.id) {
            setTimeout(() => queryClient.invalidateQueries('balance'), 1000); // in case backend didn't change balance yet
            // TODO: Add a few retries if balance after invalidation didn't change.
            // If it didn't change after all retries, show error that 'balance update failed, if the issue remains report it to support'
          }

          const nextSellingItem = updatedItems.find(
            (item: any) => !item.isSold && item !== itemSold
          );
          if (nextSellingItem) {
            nextSellingItem.isSellingNow = true;
          }

          return {
            ...prev,
            auctionItems: updatedItems,
            currentlySellingItem: nextSellingItem || prev.currentlySellingItem,
          };
        });
      },
      () => {
        setIsAuctionClosed(true);
        toast.info('Auction closed.');
      }
    );

    service.onBidMade((bid: any) => {
      setAuction((prev: any) => {
        if (!prev) return prev;

        const updatedItems = prev.auctionItems.map((item: any) =>
          item.id === bid.auctionItemId
            ? {
                ...item,
                actualPrice: bid.actualPrice,
                bids: [...item.bids, bid],
              }
            : item
        );

        return {
          ...prev,
          auctionItems: updatedItems,
        };
      });
    });

    setHubService(service);

    return () => {
      service.disconnect();
    };
  }, [auctionId]);

  return (
    <Container>
      {!isAuctionStarted ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center border border-gray-200 shadow-lg  rounded-lg bg-white p-14">
          <AccessTimeOutlinedIcon
            className="text-blue-500"
            style={{ fontSize: 60 }}
          />
          <p className="mt-2 text-lg text-blue-500">
            Waiting for the auction to start. Get ready to discover unique finds
            and incredible deals. The thrill of the auction awaits you. Don't
            miss out on the chance to claim your treasure. Stay tuned!
          </p>
        </div>
      ) : isAuctionClosed ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center border border-gray-200 shadow-lg  rounded-lg bg-white p-14">
          <InfoOutlinedIcon
            className="text-blue-500"
            style={{ fontSize: 60 }}
          />
          <p className="mt-5 text-lg text-blue-500">
            This auction has closed. Check out our other auctions and find more
            amazing items!
          </p>
        </div>
      ) : auction ? (
        <Auction data={auction} hubService={hubService} />
      ) : (
        <div>Loading Auction...</div>
      )}
    </Container>
  );
}

export default AuctionMessaging;
