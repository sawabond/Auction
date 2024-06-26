import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <div className="h-dvh w-full bg-welcome bg-no-repeat bg-cover bg-center flex flex-col justify-center">
      <div className="welcome relative flex flex-col justify-center items-center h-5/6">
        <div className="title mb-14">
          <p className="text-white text-center text-5xl not-italic font-extrabold uppercase underline-offset-2 underline">
            {t('welcomeTitle')
              .split('\n')
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </p>
        </div>
        <div className="description mb-14">
          <p className="text-white text-center text-lg not-italic font-semibold">
            {t('welcomeDescription')}
          </p>
        </div>
        <div className="register-link z-[1] space-y-4">
          <Link
            to="/auth?mode=register"
            className="uppercase border p-5 h-10 w-96 bg-white text-black flex items-center justify-center rounded-full font-bold"
          >
            {t('register')}
          </Link>
          <Link
            to="/auth?mode=login"
            className="uppercase border p-5 h-10 w-96 bg-white text-black flex items-center justify-center rounded-full font-bold"
          >
            {t('login')}
          </Link>
        </div>
        <div className="shadow-overlay absolute inset-0 bg-white opacity-20 m-auto w-2/5 rounded-lg" />
      </div>
    </div>
  );
}
