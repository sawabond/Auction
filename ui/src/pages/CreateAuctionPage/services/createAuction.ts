import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const createAuction = async (values : any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.post(`${import.meta.env.VITE_GATEWAY_URL!}/api/auctions`, values, {
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

export default createAuction;
