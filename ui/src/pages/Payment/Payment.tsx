import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from 'react-query';
import useUserFromToken from '../../hooks/useUserFromToken';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

function Payment() {
  const { t } = useTranslation();
  const token = Cookies.get('token');
  const [amount, setAmount] = useState<number>();
  const user = useUserFromToken();
  const topUpMutation = useMutation(
    (paymentData) => {
      const GATEWAY_URL = 'http://localhost:5167';
      const PaymentRedirectUrl = 'http://localhost:5173/profile';
      return axios.post(
        `${GATEWAY_URL}/api/top-up?returnUrl=${GATEWAY_URL}&redirectUrl=${PaymentRedirectUrl}`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    {
      onSuccess: (response) => {
        const paymentUrl = response.data.url;
        window.location.href = paymentUrl;
      },
      onError: (error) => {
        console.error('Error during top-up:', error);
      },
    }
  );

  const handlePayment = () => {
    topUpMutation.mutate({
      amount,
      userId: user?.id,
    } as any);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div className="max-w-md w-full mx-auto p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t('topUpPageTitle')}
        </h2>
        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            {t('amountLabel')}
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            placeholder={t('amountPlaceholder')}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          type="submit"
          onClick={handlePayment}
          disabled={topUpMutation.isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {topUpMutation.isLoading ? t('processing') : t('proceedToPayment')}
        </button>
      </div>
    </div>
  );
}

export default Payment;
