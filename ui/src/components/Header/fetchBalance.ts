import axios from 'axios';
import Cookies from 'js-cookie';

async function fetchBalance() {
  try {
    const token = Cookies.get('token');
    const response = await axios.get('http://localhost:5167/api/balances', {
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

export default fetchBalance;
