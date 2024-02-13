import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const addAuctionItem = async ({ formData, auctionId } : any) => {
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
    throw new Error('Network response was not ok');
  }
};

export default addAuctionItem;
