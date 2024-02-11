import axios from "axios";
import getTokenFromCookies from "../../../components/utils/getTokenFromCookies";

const getMyAuctions = async (cursor : any, pageSize : any) => {
    const token = getTokenFromCookies();
    const url = `${import.meta.env.VITE_GATEWAY_URL!}/api/user/auctions`;
  
    const params = new URLSearchParams({
      cursor,
      pageSize,
    });
  
    try {
      const response = await axios.get(url + `?${params}`,{
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
  
  export default getMyAuctions;