import React, { useState } from 'react';
import { useFormik } from 'formik';
import fieldRegistrationConfig from './fieldRegistrationConfig';
import { IRegisterFormValues } from '../../interfaces/Forms/IRegisterFormValues';
import { IRegisterFormProps } from '../../interfaces/Forms/IRegisterFormProps';
import validateRegisterForm from '../../Validation/validateAuthForms/validationRegisterForm';
import CustomTextField from './CustomTextField';
import { FormControl, MenuItem, TextField } from '@material-ui/core';
import { Roles } from '../enums/roles';

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

  const formik = useFormik<IRegisterFormValues>({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    },
    validate: validateRegisterForm,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="border rounded-lg bg-white h-90vh w-2/4 max-w-xl"
    >
      <div className="flex flex-col justify-center items-center gap-2 p-8">
        <h1 className="text-black text-center text-lg not-italic font-semibold uppercase">
          Register
        </h1>
        {fieldRegistrationConfig.map((field) => (
          <CustomTextField field={field} formik={formik} key={field.id} />
        ))}
        <FormControl className="w-9/12">
          <TextField
            id="role"
            name="role"
            label="Role"
            select
            variant="outlined"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role || 'Select a role'}
            error={formik.touched.role && Boolean(formik.errors.role)}
            helperText={formik.touched.role && formik.errors.role}
          >
            <MenuItem value="Select a role" style={{ display: 'none' }}>
              <em>Select a role</em>
            </MenuItem>
            {Object.values(Roles).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
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
      </div>
    </form>
  );
}

export default RegistrationForm;
