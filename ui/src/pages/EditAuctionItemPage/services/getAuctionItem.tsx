import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const getAuctionItem = async ({ auctionId, auctionItemId } : any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${auctionId}/items/${auctionItemId}`,
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

export default getAuctionItem;
