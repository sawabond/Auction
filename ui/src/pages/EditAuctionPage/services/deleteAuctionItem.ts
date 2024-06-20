import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const deleteAuctionItem = async (auctionId: any, auctionItemId: any, t: any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.delete(`${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${auctionId}/items/${auctionItemId}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      data: null
    });

    return response.data;
  } catch (error) {
    throw new Error(t('networkError'));
  }
};

export default deleteAuctionItem;
