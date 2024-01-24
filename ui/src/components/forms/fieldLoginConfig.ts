import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';
import { IFieldConfig } from './CustomTextField';

const fieldLoginConfig: IFieldConfig<ILoginFormValues>[] = [
  {
    id: 'email',
    name: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    id: 'password',
    name: 'password',
    label: 'Password',
    type: 'password',
  },
];
export default fieldLoginConfig;
