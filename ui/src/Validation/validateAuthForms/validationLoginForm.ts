import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';

function validateLoginForm(values: ILoginFormValues) {
  const errors: Partial<ILoginFormValues> = {};

  if (!values.email) {
    errors.email = 'Email is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
}
export default validateLoginForm;
