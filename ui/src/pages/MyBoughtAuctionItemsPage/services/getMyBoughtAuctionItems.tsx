import axios from "axios";
import getTokenFromCookies from "../../../components/utils/getTokenFromCookies";

const getMyBoughtAuctionItems = async (
  page: any,
  pageSize: any, 
  search: any,
  minPrice: any,
  maxPrice: any,
  t: any
  ) => {
    const token = getTokenFromCookies();

    let urlParams = {
      page,
      pageSize,
      search,
      minPrice,
      maxPrice
    }
    
    const params = new URLSearchParams(urlParams);
    let keysForDel: string[] = [];

    params.forEach((value, key) => {
      if (value == "null") {
        keysForDel.push(key);
      }
    });
    keysForDel.forEach(key => {
      params.delete(key);
    });

    const baseUrl = `${import.meta.env.VITE_GATEWAY_URL!}/api/user/items`;
    const finalUrl = baseUrl + (params.toString() ? `?${params.toString()}` : '');
  
    try {
      const response = await axios.get(finalUrl,{
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
  
  export default getMyBoughtAuctionItems;