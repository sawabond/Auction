import getTokenFromCookies from '../../../components/utils/getTokenFromCookies';

const createAuction = async (values: any) => {
  const token = getTokenFromCookies();
  const response = await fetch('http://localhost:5167/api/auctions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the token in the request headers
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export default createAuction;
