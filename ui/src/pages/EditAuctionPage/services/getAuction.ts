import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const getAuction = async (auctionId: any, t: any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.get(`${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${auctionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(t('networkError'));
  }
};

export default getAuction;
