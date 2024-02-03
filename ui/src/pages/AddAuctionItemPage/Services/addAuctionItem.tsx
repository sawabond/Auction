import axios from 'axios';
import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const addAuctionItem = async (formData : any) => {
  const currentUrl = window.location.href;
  const auctionId = currentUrl.split('/')[4];
  const token = getTokenFromCookies(); // Ensure to call the function to retrieve the token

  try {
    const response = await axios.post(
      `http://localhost:5167/api/auctions/${auctionId}/items`,
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
