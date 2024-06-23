import { useTranslation } from "react-i18next";

const useFieldRegistrationConfig = () => {
  const { t } = useTranslation();

  return [
    {
      id: 'firstName',
      name: 'firstName',
      label: t('firstName'),
      type: 'text',
    },
    {
      id: 'lastName',
      name: 'lastName',
      label: t('lastName'),
      type: 'text',
    },
    {
      id: 'email',
      name: 'email',
      label: t('email'),
      type: 'email',
    },
    {
      id: 'password',
      name: 'password',
      label: t('password'),
      type: 'password',
    },
    {
      id: 'confirmPassword',
      name: 'confirmPassword',
      label: t('confirmPassword'),
      type: 'password',
    },
  ];
};

export default useFieldRegistrationConfig;
