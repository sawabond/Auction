import React from 'react';
import { useTranslation } from 'react-i18next';

const Bid: React.FC<any> = ({ bid }) => {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t('bidAmount')}: {bid.amount}</p>
      <p>{t('date')}: {bid.date}</p>
      <p>{t('actualPrice')}: {bid.actualPrice}</p>
    </div>
  );
};

export default Bid;
