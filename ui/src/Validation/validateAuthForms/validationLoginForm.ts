import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';

function validateLoginForm(values: ILoginFormValues, t: any) {
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
