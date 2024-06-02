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
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';

  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(values.password)
  ) {
    errors.password =
      'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.role || values.role === 'Select a role') {
    errors.role = 'Role must be selected';
  }
  return errors;
}
export default validateRegisterForm;
