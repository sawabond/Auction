import { useState } from 'react';
import { useFormik } from 'formik';
import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import { IRegisterFormProps } from '../../interfaces/Forms/IRegisterFormProps';
import validateRegisterForm from '../../Validation/validateAuthForms/validationRegisterForm';
import CustomTextField from './CustomTextField';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { Roles } from '../enums/roles';
import { useTranslation } from 'react-i18next';
import useFieldRegistrationConfig from './fieldRegistrationConfig';

function RegistrationForm({
  onSubmit,
  toggleForm
}: IRegisterFormProps) {
  const [isClicked, setIsClicked] = useState(false);
  const handleButtonClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  const { t } = useTranslation();

  const formik = useFormik<IRegisterFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '', // Ensure role is initialized
    },
    validate: (values) => validateRegisterForm(values, t),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const fieldRegistrationConfig = useFieldRegistrationConfig();

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="border rounded-lg bg-white h-90vh w-2/4 max-w-xl"
    >
      <div className="flex flex-col justify-center items-center gap-2 p-8">
        <h1 className="text-black text-center text-lg not-italic font-semibold uppercase">
          {t('registerTitle')}
        </h1>
        {fieldRegistrationConfig.map((field) => (
          <CustomTextField field={field} formik={formik} key={field.id} />
        ))}
        <FormControl className="w-9/12">
          <TextField
            id="role"
            name="role"
            label={t('role')}
            select
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role} // Ensure value is controlled
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            <MenuItem value="" style={{ display: 'none' }}>
              <em>{t('selectRole')}</em>
            </MenuItem>
            {Object.values(Roles).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <button
          type="submit" // Ensure button type is submit
          className={`w-9/12 h-10 rounded text-white uppercase transition-transform ${
            isClicked ? 'transform scale-105' : ''
          }`}
          style={{ background: 'rgba(5, 81, 81, 0.80)' }}
          onClick={handleButtonClick}
        >
          {t('signUp')}
        </button>
        <p className="text-blue-500">
          <button
            type="button"
            className="link-button underline"
            onClick={toggleForm}
          >
            {t('alreadyHaveAccount')}
          </button>
        </p>
      </div>
    </form>
  );
}

export default RegistrationForm;
