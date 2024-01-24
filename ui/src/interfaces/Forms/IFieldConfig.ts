export interface IFieldConfig<T> {
  id: string;
  name: keyof T | string;
  label: string;
  type: string;
}
