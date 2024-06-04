import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useUserFromToken from '../../hooks/useUserFromToken';

function Profile() {
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    phoneNumber: '',
    city: '',
    department: '',
  });
  const user = useUserFromToken();
  const GATEWAY_URL = 'http://localhost:5167';
  useEffect(() => {
    axios
      .get(`${GATEWAY_URL}/api/users/${user?.id}`)
      .then((response) => {
        setInitialValues({
          firstName: response.data.shipmentInformation.firstName || '',
          lastName: response.data.shipmentInformation.lastName || '',
          patronymic: response.data.shipmentInformation.patronymic || '',
          phoneNumber: response.data.shipmentInformation.phoneNumber || '',
          city: response.data.shipmentInformation.city || '',
          department: response.data.shipmentInformation.department || '',
        });
      })
      .catch((error) => console.error('Failed to fetch profile data:', error));
  }, []);

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    axios
      .put(`${GATEWAY_URL}/api/users/${user?.id}/shipment`, values)
      .then(() => {
        console.log('Profile updated successfully');
      })
      .catch((error) => console.error('Error updating profile:', error))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {t('profilePageTitle')}
        </h2>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block font-semibold">
                  {t('firstName')}
                </label>
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder={t('firstName')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-semibold">
                  {t('lastName')}
                </label>
                <Field
                  id="lastName"
                  name="lastName"
                  placeholder={t('lastName')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label htmlFor="patronymic" className="block font-semibold">
                  {t('patronymic')}
                </label>
                <Field
                  id="patronymic"
                  name="patronymic"
                  placeholder={t('patronymic')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block font-semibold">
                  {t('phoneNumber')}
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder={t('phoneNumber')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label htmlFor="city" className="block font-semibold">
                  {t('city')}
                </label>
                <Field
                  id="city"
                  name="city"
                  placeholder={t('city')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div>
                <label htmlFor="department" className="block font-semibold">
                  {t('department')}
                </label>
                <Field
                  id="department"
                  name="department"
                  placeholder={t('department')}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-700 w-full"
                >
                  {t('saveChanges')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Profile;
