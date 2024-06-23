import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, List } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import getTokenFromCookies from '../../components/utils/getTokenFromCookies';

const fetchAuctionItems = async (auctionId: string | undefined, page: number, pageSize: number) => {
  const token = getTokenFromCookies();
  const response = await axios.get(
    `${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${auctionId}/items?page=1&pageSize=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const fetchUserEmail = async (userId: string) => {
  const token = getTokenFromCookies();
  const response = await axios.get(
    `${import.meta.env.VITE_GATEWAY_URL!}/api/users/${userId}/email`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

function SoldAuctionItemsPage() {
  const { auctionId } = useParams();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [userEmails, setUserEmails] = useState<{ [key: string]: string }>({});

  const { data, isError, isLoading, error } = useQuery(['auctionItems', auctionId, page, pageSize], () =>
    fetchAuctionItems(auctionId, page, pageSize)
  );

  useEffect(() => {
    if (isError) {
      const errorMessage = error instanceof Error ? error.message : t('unknownError');
      toast.error(`${t('fetchError')}: ${errorMessage}`);
    }
  }, [isError, error, t]);

  useEffect(() => {
    if (data && data.items) {
      const fetchEmails = async () => {
        const emails: { [key: string]: string } = {};
        for (const item of data.items) {
          if (item.bids.length > 0) {
            const lastBid = item.bids[item.bids.length - 1];
            if (!emails[lastBid.userId]) {
              const email = await fetchUserEmail(lastBid.userId);
              emails[lastBid.userId] = email;
            }
          }
        }
        setUserEmails(emails);
      };

      fetchEmails();
    }
  }, [data]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <div>{t('fetchError')}</div>;
  }

  const soldItems = data?.items?.filter((item: any) => item.bids.length > 0) || [];

  if (soldItems.length === 0) {
    return <div>{t('noSoldItems')}</div>;
  }

  return (
    <List className="flex flex-col gap-4">
      {soldItems.map((item: any) => {
        const lastBid = item.bids[item.bids.length - 1];
        const userEmail = userEmails[lastBid.userId];

        return (
          <Card  className="MuiBox-root grid grid-cols-6 items-center gap-4">
            <CardMedia
                component="img"
                image={item.photos[0].photoUrl}
                alt={t('yourImage')}
                className="w-2/3 h-32 object-cover"
            />
            <Typography gutterBottom variant="h5" component="div">
              {item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {item.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {t('startingPrice')}: {item.startingPrice}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {t('actualPrice')}: {item.actualPrice}
            </Typography>
            {userEmail && (
              <Typography variant="body2" color="textSecondary" component="p">
                {t('lastBidUserEmail')}: {userEmail}
              </Typography>
            )}
          </Card>
        );
      })}
    </List>
  );
}

export default SoldAuctionItemsPage;
