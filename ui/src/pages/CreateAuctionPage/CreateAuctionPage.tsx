import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import createAuction from './services/createAuction';

const ENGLISH_TYPE = 0;

function CreateAuctionPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const initialValues = {
    name: '',
    description: '',
    startTime: '',
    auctionType: ENGLISH_TYPE,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('nameRequired')),
    description: Yup.string().required(t('descriptionRequired')),
    startTime: Yup.string().required(t('startTimeRequired')),
  });

  const mutation = useMutation((values: any) => createAuction(values, t), {
    onSuccess: (data) => {
      const auctionId = data; // Assuming the response data contains auctionId
      toast.success(t('auctionCreatedSuccess'));
      navigate(`/auctions/${auctionId}/items/add`);
    },
    onError: (error: any) => {
      toast.error(`${t('auctionCreatedError')}: ${error.message}`);
    },
  });

  const handleSubmit = (values: any) => {
    const adjustedValues = {
      ...values,
      startTime: new Date(values.startTime).toISOString(), // Convert to ISO 8601 format
    };
    mutation.mutate(adjustedValues);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange }) => (
        <div className="flex flex-col justify-center items-center h-[90vh]">
          <h1 className="text-3xl font-bold mb-4">{t('createAuctionTitle')}</h1>
          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <Field
              as={TextField}
              className="mb-2"
              name="name"
              label={t('name')}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="description"
              label={t('description')}
              multiline
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              type="datetime-local"
              label={t('startTime')}
              name="startTime"
              value={values.startTime}
              onChange={handleChange}
              error={touched.startTime && !!errors.startTime}
              helperText={touched.startTime && errors.startTime}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 1 }}
            />
            <Button type="submit">{t('create')}</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default CreateAuctionPage;
