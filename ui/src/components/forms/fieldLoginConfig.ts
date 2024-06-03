import { useTranslation } from 'react-i18next';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';
import { IFieldConfig } from '../../interfaces/Forms/IFieldConfig';

const useFieldLoginConfig = (): IFieldConfig<ILoginFormValues>[] => {
  const { t } = useTranslation();

  return [
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
  ];
};

export default useFieldLoginConfig;
