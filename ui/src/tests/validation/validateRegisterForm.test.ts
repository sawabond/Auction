import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import validateRegisterForm from '../../Validation/validateAuthForms/validationRegisterForm';

describe('validateRegisterForm', () => {
  const t = (key: string) => key;

  it('should return an error if firstName is missing', () => {
    const values: IRegisterFormValues = {
      firstName: '',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.firstName).toBe('firstNameRequired');
  });

  it('should return an error if lastName is missing', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: '',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.lastName).toBe('lastNameRequired');
  });

  it('should return an error if email is missing', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.email).toBe('emailRequired');
  });

  it('should return an error if email is invalid', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.email).toBe('invalidEmail');
  });

  it('should return an error if password is missing', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: '',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.password).toBe('passwordRequired');
  });

  it('should return an error if password is invalid', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      confirmPassword: 'password',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.password).toBe('invalidPassword');
  });

  it('should return an error if confirmPassword is missing', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: '',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.confirmPassword).toBe('confirmPasswordRequired');
  });

  it('should return an error if confirmPassword does not match password', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.confirmPassword).toBe('invalidConfirmPassword');
  });

  it('should return an error if role is not selected', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: '',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors.role).toBe('roleRequired');
  });

  it('should return no errors if all fields are valid', () => {
    const values: IRegisterFormValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      role: 'User',
    };
    const errors = validateRegisterForm(values, t);
    expect(errors).toEqual({});
  });
});
