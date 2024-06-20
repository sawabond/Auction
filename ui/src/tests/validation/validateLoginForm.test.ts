import validateLoginForm from '../../Validation/validateAuthForms/validationLoginForm';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';

describe('validateLoginForm', () => {
  const t = (key: string) => key;

  it('should return an error if email is missing', () => {
    const values: ILoginFormValues = { email: '', password: 'password123' };
    const errors = validateLoginForm(values, t);
    expect(errors.email).toBe('emailRequired');
  });

  it('should return an error if password is missing', () => {
    const values: ILoginFormValues = {
      email: 'test@example.com',
      password: '',
    };
    const errors = validateLoginForm(values, t);
    expect(errors.password).toBe('passwordRequired');
  });

  it('should return no errors if email and password are provided', () => {
    const values: ILoginFormValues = {
      email: 'test@example.com',
      password: 'password123',
    };
    const errors = validateLoginForm(values, t);
    expect(errors).toEqual({});
  });
});
