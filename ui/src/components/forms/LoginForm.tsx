import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ILoginFormProps } from '../../interfaces/Forms/ILoginFormProps';
import { ILoginFormValues } from '../../interfaces/Forms/ILoginFormValues';
import validateLoginForm from '../../Validation/validateAuthForms/validationLoginForm';
import CustomTextField from './CustomTextField';
import fieldLoginConfig from './fieldLoginConfig';

function LoginForm({ onSubmit, toggleForm }: ILoginFormProps) {
  const { t } = useTranslation();
  const [isClicked, setIsClicked] = useState(false);
  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  const formik = useFormik<ILoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: validateLoginForm,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="border rounded-lg flex flex-col items-center justify-center bg-white h-4/6 w-2/4 gap-4 max-w-xl"
    >
      <h1 className="text-black text-center text-lg not-italic font-semibold uppercase">
        {t('loginTitle')}
      </h1>
      {fieldLoginConfig.map((field) => (
        <CustomTextField field={field} formik={formik} key={field.id} />
      ))}

      <button
        type="submit"
        className={`w-9/12 h-10 rounded text-white uppercase transition-transform ${
          isClicked ? 'transform scale-105' : ''
        }`}
        style={{ background: 'rgba(5, 81, 81, 0.80)' }}
        onClick={handleButtonClick}
      >
        {t('signIn')}
      </button>
      <p className="text-blue-500">
        <button
          type="button"
          className="link-button underline"
          onClick={toggleForm}
        >
          {t('registerLinkText')}
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
