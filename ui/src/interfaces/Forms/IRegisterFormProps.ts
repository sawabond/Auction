import { IRegisterFormValues } from './IRegisterFormValues';

export interface IRegisterFormProps {
  onSubmit: (values: IRegisterFormValues) => void;
  toggleForm: () => void;
  handleGoogleSignIn: () => void;
}
