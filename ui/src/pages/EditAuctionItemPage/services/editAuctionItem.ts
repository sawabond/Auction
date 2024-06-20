import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const editAuctionItem = async (formData: any, auctionId: any, t: any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.put(
      `${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${auctionId}/items`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(t('networkError'));
  }
};

export default editAuctionItem;
