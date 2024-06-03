import axios from "axios";
import getTokenFromCookies from "../../../components/utils/getTokenFromCookies";

const getMyAuctions = async (    
  cursor : any, 
  pageSize : any,
  search : any,
  description : any,
  onlyActive : any,
  t : any
) => {

  let urlParams = {
    cursor,
    pageSize,
    'name.[sw]': search,
    'description.[contains]': description,
    onlyActive
  }
  const token = getTokenFromCookies();

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

  const baseUrl = `${import.meta.env.VITE_GATEWAY_URL!}/api/user/auctions`;
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

export default getMyAuctions;