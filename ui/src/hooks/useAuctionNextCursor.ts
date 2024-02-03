import { useState } from 'react';

function useAuctionNextCursor(
  initialCursor: string
): [string, (newCursor: string) => void] {
  const [cursor, setCursor] = useState<string>(initialCursor);

  const updateCursor = (newCursor: string) => {
    setCursor(newCursor);
  };

  return [cursor, updateCursor];
}

export default useAuctionNextCursor;
