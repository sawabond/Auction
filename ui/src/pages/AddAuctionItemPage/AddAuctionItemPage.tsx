import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MultipleFileUploadField from './elements/MultipleFileUploadField'; // Import the component to handle multiple file uploads
import { useState } from 'react';
import createAuction from '../CreateAuctionPage/services/createAuction';
import addAuctionItem from './Services/addAuctionItem';

function AddAuctionItemPage() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const initialValues = {
    startingPrice: "",
    minimalBid: "",
    name: "",
    description: "",
    photos: []
  };

  const validationSchema = yup.object().shape({
    startingPrice: yup.number().positive("Starting price must be positive").required("Starting price is required"),
    minimalBid: yup.number().positive("Minimal bid must be positive").required('Minimal bid is required'),
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    photos: yup.array() 
  });

  const mutation = useMutation(addAuctionItem, {
    onSuccess: () => {
      toast.success('Auction created successfully!');
      navigate('/my-auctions');
    },
    onError: (error: any) => {
      toast.error(`Error while creating auction: ${error.message}`);
    },
  });



  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const formData = new FormData();
    formData.append("startingPrice", values.startingPrice);
    formData.append("minimalBid", values.minimalBid);
    formData.append("name", values.name);
    formData.append("description", values.description);

    // Append uploaded files to formData
    uploadedFiles.forEach((file, index) => {
      formData.append(`photos[${index}]`, file);
    });

    try {
      await mutation.mutateAsync(formData);
    } catch (error: any) {
      console.error('Error while creating auction item:', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Create Auction</h1>
          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <Field
              as={TextField}
              className="mb-2"
              name="startingPrice"
              label="Starting price"
              error={touched.startingPrice && !!errors.startingPrice}
              helperText={touched.startingPrice && errors.startingPrice}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="minimalBid"
              label="Minimal bid"
              error={touched.minimalBid && !!errors.minimalBid}
              helperText={touched.minimalBid && errors.minimalBid}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
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
            <MultipleFileUploadField name="photos" onFilesChange={handleFilesChange}/> {/* Pass the name of the field for multiple file uploads */}
            <Button type="submit">Create</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default AddAuctionItemPage;


