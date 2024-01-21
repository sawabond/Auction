import { FormikProps } from 'formik';
import { IFieldConfig } from './IFieldConfig';

export interface ICustomTextFieldProps<T> {
  field: IFieldConfig<T>;
  formik: FormikProps<T>;
}
