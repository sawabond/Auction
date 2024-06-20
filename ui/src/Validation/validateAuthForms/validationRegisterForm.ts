import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';

function validateRegisterForm(values: IRegisterFormValues, t: any) {
  const errors: Partial<IRegisterFormValues> = {};

  if (!values.firstName) {
    errors.firstName = t('firstNameRequired');
  }

  if (!values.lastName) {
    errors.lastName = t('lastNameRequired');
  }

  if (!values.email) {
    errors.email = t('emailRequired');
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = t('invalidEmail');
  }

  if (!values.password) {
    errors.password = t('passwordRequired');

  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(values.password)
  ) {
    errors.password = t('invalidPassword');
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = t('confirmPasswordRequired');
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = t('invalidConfirmPassword');
  }

  if (!values.role || values.role == t('selectRole')) {
    errors.role = t('roleRequired');
  }
  return errors;
}
export default validateRegisterForm;
