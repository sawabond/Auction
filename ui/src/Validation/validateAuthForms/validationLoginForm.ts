import { useTranslation } from 'react-i18next';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';

function validateLoginForm(values: ILoginFormValues) {
  const { t } = useTranslation();
  const errors: Partial<ILoginFormValues> = {};

  if (!values.email) {
    errors.email = t('emailRequired');
  }

  if (!values.password) {
    errors.password = t('passwordRequired');
  }

  return errors;
}
export default validateLoginForm;
