import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import createAuction from './services/createAuction';
import { AuctionType } from '../../components/enums/AuctionType';

const auctionTypeOptions = Object.keys(AuctionType)
  .filter((key) => !Number.isNaN(Number(key)))
  .map((key) => ({
    value: Number(key),
    label: AuctionType[key as keyof typeof AuctionType],
  }));
  
function CreateAuctionPage() {
  const navigate = useNavigate();
  const initialValues = {
    name: '',
    description: '',
    startTime: '',
    auctionType: AuctionType.English,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    startTime: Yup.string().required('Start time is required'),
    auctionType: Yup.number()
      .required('Auction type is required')
      .oneOf(
        Object.keys(AuctionType)
          .map((key) => Number(AuctionType[key as keyof typeof AuctionType]))
          .filter((value) => !Number.isNaN(value))
      ),
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
            <TextField
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

            <FormControl>
              <InputLabel>Auction Type</InputLabel>
              <Field
                as={Select}
                name="auctionType"
                error={touched.auctionType && !!errors.auctionType}
              >
                {auctionTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            {touched.auctionType && errors.auctionType && (
              <div>{errors.auctionType}</div>
            )}
            <Button type="submit">Create</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default CreateAuctionPage;
