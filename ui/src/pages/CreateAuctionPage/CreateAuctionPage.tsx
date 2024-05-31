import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button } from '@mui/material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import createAuction from './services/createAuction';

const ENGLISH_TYPE = 0;

function CreateAuctionPage() {
  const navigate = useNavigate();
  const initialValues = {
    name: '',
    description: '',
    startTime: '',
    auctionType: ENGLISH_TYPE,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    startTime: Yup.string().required('Start time is required')
  });

  const mutation = useMutation(createAuction, {
    onSuccess: () => {
      toast.success('Auction created successfully!');
      navigate('/auctions/my-auctions');
    },
    onError: (error: any) => {
      toast.error(`Error while creating auction: ${error.message}`);
    },
  });
  const handleSubmit = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange }) => (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Create Auction</h1>
          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <Field
              as={TextField}
              className="mb-2"
              name="name"
              label="Name"
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="description"
              label="Description"
              multiline
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              type="datetime-local"
              label="Start Time"
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
            <Button type="submit">Create</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default CreateAuctionPage;
