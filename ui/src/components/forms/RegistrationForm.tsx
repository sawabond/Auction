import React, { useState } from 'react';
import { useFormik } from 'formik';
import GoogleIcon from '../../images/Google.svg';
import fieldRegistrationConfig from './fieldRegistrationConfig';
import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import { IRegisterFormProps } from '../../interfaces/Forms/IRegisterFormProps';
import validateRegisterForm from '../../Validation/validateAuthForms/validationRegisterForm';
import CustomTextField from './CustomTextField';

function RegistrationForm({
  onSubmit,
  toggleForm,
  handleGoogleSignIn,
}: IRegisterFormProps) {
  const [isClicked, setIsClicked] = useState(false);
  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };
  const formik = useFormik<IRegisterFormValues>({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateRegisterForm,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="border rounded-lg bg-white h-90vh w-2/4  max-w-xl"
    >
      <div className="flex flex-col justify-center items-center gap-2 p-8">
        <h1 className="text-black text-center text-lg not-italic font-semibold uppercase">
          Register
        </h1>
        {fieldRegistrationConfig.map((field) => (
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
          Sign up
        </button>
        <p className="text-blue-500">
          <button
            type="button"
            className="link-button underline"
            onClick={toggleForm}
          >
            Already have an account? Login
          </button>
        </p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="border border-emerald-600 rounded text-black text-center text-xs not-italic font-normal capitalize w-8/12 h-10 flex items-center justify-center gap-1"
        >
          <img src={GoogleIcon} alt="Google Icon" className="w-6" />
          Continue with Google
        </button>
      </div>
    </form>
  );
}

export default RegistrationForm;
