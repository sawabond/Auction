import axios from "axios";

  const getAllAuctions = async (cursor : any, pageSize : any) => {
    const url = `${import.meta.env.VITE_GATEWAY_URL!}/api/auctions`;
  
    const params = new URLSearchParams({
      cursor,
      pageSize,
    });

    try {
      const response = await axios.get(url + `?${params}`);
      return response.data;
    } catch (error) {
      throw new Error('Network response was not ok');
    }
  };
  
  export default getAllAuctions;