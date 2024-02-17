import axios from "axios";
import getTokenFromCookies from "../../../components/utils/getTokenFromCookies";

const getMyAuctions = async (pageSize : any, cursor : any) => {
    const token = getTokenFromCookies();
    const url = `${import.meta.env.VITE_GATEWAY_URL!}/api/user/auctions`;
  
    const params = new URLSearchParams({
      pageSize,
      cursor,
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