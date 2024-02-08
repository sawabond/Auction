import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const deleteAuctionItem = async (auctionId : any, auctionItemId : any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.delete(`http://localhost:5167/api/auctions/${auctionId}/items/${auctionItemId}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      data: null
    });

    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export default deleteAuctionItem;
