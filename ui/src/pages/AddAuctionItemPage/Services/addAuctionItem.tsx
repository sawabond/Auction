import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const addAuctionItem = async (formData: any, auctionId: any, t: any) => {
  const token = getTokenFromCookies(); // Ensure to call the function to retrieve the token

  try {
    const response = await axios.post(
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

export default addAuctionItem;
