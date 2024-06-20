export interface IRegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  [key: string]: string; // Index signature allowing indexing with a string
}
