import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const editAuction = async (values: any, t: any) => {
  const token = getTokenFromCookies();

  try {
    const response = await axios.put(`${import.meta.env.VITE_GATEWAY_URL!}/api/auctions`, values, {
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

export default editAuction;
