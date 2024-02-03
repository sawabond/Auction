const getTokenFromCookies = (): string | undefined => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='));
  if (cookie) {
    return cookie.split('=')[1];
  }
  return undefined;
};

export default getTokenFromCookies;
