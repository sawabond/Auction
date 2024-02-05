import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const getAuction = async (auctionId : any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.get(`http://localhost:5167/api/auctions/${auctionId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error('Network response was not ok');
  }
};

export default getAuction;
