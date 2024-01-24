export interface IRegisterFormValues {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string; // Index signature allowing indexing with a string
}
