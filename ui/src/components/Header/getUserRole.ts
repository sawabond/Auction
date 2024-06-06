import axios from 'axios';
import Cookies from 'js-cookie';

async function getUserRole(userId: any) {
  try {
    const token = Cookies.get('token');

    const response = await axios.get( 
    `${import.meta.env.VITE_GATEWAY_URL!}/api/auctions/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default getUserRole;
