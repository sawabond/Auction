import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';

function validateRegisterForm(values: IRegisterFormValues) {
  const errors: Partial<IRegisterFormValues> = {};
  if (!values.name) {
    errors.name = 'Name is required';
  }
  if (!values.surname) {
    errors.surname = 'Surname is required';
  }
  if (!values.email) {
    errors.email = 'Email is required';
  }
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
}
export default validateRegisterForm;
