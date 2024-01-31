import getTokenFromCookies from "../../../components/utils/getTokenFromCookies";

const addAuctionItem = async (formData : any) => {
  const currentUrl = window.location.href;
  const auctionId = currentUrl.split('/')[4];
  const token = getTokenFromCookies(); // Ensure to call the function to retrieve the token

  const response = await fetch(`http://localhost:5167/api/auctions/${auctionId}/items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export default addAuctionItem;
