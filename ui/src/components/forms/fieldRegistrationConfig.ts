import { useTranslation } from "react-i18next";

const useFieldRegistrationConfig = () => {
  const { t } = useTranslation();

  return [
    {
      id: 'name',
      name: 'name',
      label: t('firstName'),
      type: 'text',
    },
    {
      id: 'surname',
      name: 'surname',
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
