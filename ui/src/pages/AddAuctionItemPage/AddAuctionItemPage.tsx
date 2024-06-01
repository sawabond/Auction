import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MultipleFileUploadField from '../../components/elements/Drag and drop/MultipleFileUploadField';
import addAuctionItem from './services/addAuctionItem';

function AddAuctionItemPage() {
  const navigate = useNavigate();
  const { auctionId } = useParams();
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { t } = useTranslation();
  const initialValues = {
    startingPrice: '',
    minimalBid: '',
    name: '',
    description: '',
    photos: [],
  };

  const validationSchema = yup.object().shape({
    startingPrice: yup
      .number()
      .positive(t('startingPricePositive'))
      .required(t('startingPriceRequired')),
    minimalBid: yup
      .number()
      .positive(t('minimalBidPositive'))
      .required(t('minimalBidRequired')),
    name: yup
      .string()
      .max(50, t('itemNameMax'))
      .required(t('itemNameRequired')),
    description: yup
      .string()
      .max(500, t('itemDescriptionMax'))
      .required(t('itemDescriptionRequired')),
  });

  const mutation = useMutation(addAuctionItem, {
    onSuccess: () => {
      toast.success('Auction item added successfully!');
    },
    onError: (error: any) => {
      toast.error(`${t('auctionItemAddedError')}: ${error.message}`);
    },
  });

  const handleFilesChange = (files: File[]) => {
    setUploadedPhotos(files);
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any,
    isMultiple: boolean
  ) => {
    setIsFormSubmitted(false);
    const formData = new FormData();
    formData.append('startingPrice', values.startingPrice);
    formData.append('minimalBid', values.minimalBid);
    formData.append('name', values.name);
    formData.append('description', values.description);

    for (let index = 0; index < uploadedPhotos.length; index++) {
      const file = uploadedPhotos[index];

      if (file.name.match(/(.jpg|.jpeg|.png|.jfif|.pjpeg|.pjp)$/gm)) {
        formData.append(`photos[${index}]`, file);
      } else {
        return;
      }
    }
    try {
      await mutation.mutateAsync({ formData, auctionId });
      resetForm();
      clearFiles();
      setIsFormSubmitted(true);

      if (!isMultiple) {
        navigate(`/auctions/${auctionId}/edit`);
      }
    } catch (error: any) {
      console.error('Error while creating auction item:', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitSingle = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    await handleSubmit(values, { setSubmitting, resetForm }, false);
  };

  const handleSubmitMultiple = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
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
          <h1 className="text-3xl font-bold mb-4">
            {t('addAuctionItemTitle')}
          </h1>
          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <Field
              as={TextField}
              className="mb-2"
              name="startingPrice"
              label={t('startingPrice')}
              error={touched.startingPrice && !!errors.startingPrice}
              helperText={touched.startingPrice && errors.startingPrice}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="minimalBid"
              label={t('minimalBid')}
              error={touched.minimalBid && !!errors.minimalBid}
              helperText={touched.minimalBid && errors.minimalBid}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="name"
              label={t('itemName')}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              name="description"
              label={t('itemDescription')}
              multiline
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ mb: 1 }}
            />
            <MultipleFileUploadField
              name="photos"
              onFilesChange={handleFilesChange}
              isFormSubmitted={isFormSubmitted}
            />
            <Button type="submit" name="button_add_one">
              {t('add')}
            </Button>
            <Button
              type="button"
              name="button_add_multiple"
              onClick={() =>
                handleSubmitMultiple(values, { setSubmitting, resetForm })
              }
            >
              {t('addMultiple')}
            </Button>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default AddAuctionItemPage;
