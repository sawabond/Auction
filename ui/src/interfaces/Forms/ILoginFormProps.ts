import { ILoginFormValues } from './ILoginFormValues';

export interface ILoginFormProps {
  onSubmit: (values: ILoginFormValues) => void;
  toggleForm: () => void;
  handleGoogleSignIn: () => void;
}
