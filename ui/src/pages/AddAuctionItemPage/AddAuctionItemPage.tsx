import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import MultipleFileUploadField from './elements/MultipleFileUploadField';
import { useState } from 'react';
import addAuctionItem from './Services/addAuctionItem';
import { useNavigate } from 'react-router-dom';

function AddAuctionItemPage() {
  const navigate = useNavigate();  
  const currentUrl = window.location.href;
  const auctionId = currentUrl.split('/')[4];
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const initialValues = {
    startingPrice: "",
    minimalBid: "",
    name: "",
    description: "",
    photos: []
  };

  const validFileExtensions: { [key: string]: string[] } = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };
  
  function isValidFileType(fileName: string, fileType: string): boolean {
    const validExtensions = validFileExtensions[fileType];
    if (!validExtensions || validExtensions.length === 0) return false;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    return !!fileExtension && validExtensions.includes(fileExtension);
  }
  

  const validationSchema = yup.object().shape({
    startingPrice: yup
      .number()
      .positive("Starting price must be positive")
      .required("Starting price is required"),
    minimalBid: yup
      .number()
      .positive("Minimal bid must be positive")
      .required("Minimal bid is required"),
    name: yup
      .string()
      .max(50, "Name must have less than 50 symbols")
      .required("Name is required"),
    description: yup
      .string()
      .max(500, "Description must have less than 500 symbols")
      .required("Description is required"),
  });
  
  const mutation = useMutation(addAuctionItem, {
    onSuccess: () => {
      toast.success('Auction item added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Error while creating auction: ${error.message}`);
    },
  });

  const handleFilesChange = (files: File[]) => {
    setUploadedPhotos(files);
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any, isMultiple: boolean) => {
    setIsFormSubmitted(false);
    const formData = new FormData();
    formData.append("startingPrice", values.startingPrice);
    formData.append("minimalBid", values.minimalBid);
    formData.append("name", values.name);
    formData.append("description", values.description);
  
    for (let index = 0; index < uploadedPhotos.length; index++) {
      const file = uploadedPhotos[index];
      
      if (file.name.match(/(.jpg|.png)$/gm)) {
        formData.append(`photos[${index}]`, file);
      } else {
        return;
      }
    }
    try {
      await mutation.mutateAsync(formData);
      resetForm();
      clearFiles();
      setIsFormSubmitted(true);
      
      if (!isMultiple) {
        navigate(`/edit-auction/${auctionId}`);
      }
    } catch (error: any) {
      console.error('Error while creating auction item:', error.message);
    } finally {
      setSubmitting(false);
    }
  };  
  
  const handleSubmitSingle = async (values: any, { setSubmitting, resetForm }: any) => {
    await handleSubmit(values, { setSubmitting, resetForm }, false);
  };
  
  const handleSubmitMultiple = async (values: any, { setSubmitting, resetForm }: any) => {
    await handleSubmit(values, { setSubmitting, resetForm }, true);
  };

  const clearFiles = () => {
    setUploadedPhotos([]);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitSingle}
    >
      {({ errors, touched, values, setSubmitting, resetForm }) => (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Add Auction Item</h1>
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
            <MultipleFileUploadField name="photos" onFilesChange={handleFilesChange} isFormSubmitted={isFormSubmitted}/> 
            <Button type="submit" name="button_add_one">Add</Button>
            <Button type="button" name="button_add_multiple" onClick={() => handleSubmitMultiple(values, {setSubmitting, resetForm})}>Add multiple</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default AddAuctionItemPage;
