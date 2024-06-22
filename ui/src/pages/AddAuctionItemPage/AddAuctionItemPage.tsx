import React, { useState } from 'react';
import { Formik, Form, Field, useField } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MultipleFileUploadField from '../../components/elements/Drag and drop/MultipleFileUploadField';
import addAuctionItem from './services/addAuctionItem';
import TimeInputField from '../../components/elements/TimeInputField';

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
    sellingPeriod: '', // Add initial value for sellingPeriod
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
    sellingPeriod: yup
      .string()
      .matches(
        /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
        t('sellingPeriodFormat')
      )
      .required(t('sellingPeriodRequired')), // Add validation for sellingPeriod
  });

  const mutation = useMutation(
    (formData: FormData) => addAuctionItem(formData, auctionId, t),
    {
      onSuccess: () => {
        toast.success(t('auctionItemAddedSuccess'));
      },
      onError: (error: any) => {
        toast.error(`${t('auctionItemAddedError')}: ${error.message}`);
      },
    }
  );

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
    formData.append('sellingPeriod', values.sellingPeriod);

    for (let index = 0; index < uploadedPhotos.length; index++) {
      const file = uploadedPhotos[index];
      if (file.name.match(/(.jpg|.jpeg|.png|.jfif|.pjpeg|.pjp)$/gm)) {
        formData.append(`photos`, file);
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
        <div className="flex flex-col justify-center items-center h-[90vh]">
          <h1 className="text-3xl font-bold mb-4">
            {t('addAuctionItemTitle')}
          </h1>
          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <Field
              as={TextField}
              id="startingPrice"
              className="mb-2"
              name="startingPrice"
              label={t('startingPrice')}
              error={touched.startingPrice && !!errors.startingPrice}
              helperText={touched.startingPrice && errors.startingPrice}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              id="minimalBid"
              name="minimalBid"
              label={t('minimalBid')}
              error={touched.minimalBid && !!errors.minimalBid}
              helperText={touched.minimalBid && errors.minimalBid}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              id="name"
              name="name"
              label={t('itemName')}
              error={touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ mb: 1 }}
            />
            <Field
              as={TextField}
              id="description"
              name="description"
              label={t('itemDescription')}
              multiline
              error={touched.description && !!errors.description}
              helperText={touched.description && errors.description}
              sx={{ mb: 1 }}
            />
            <Field
              as={TimeInputField}
              id="sellingPeriod"
              name="sellingPeriod"
              label={t('sellingPeriod')}
              placeholder="HH:MM:SS"
              error={touched.sellingPeriod && !!errors.sellingPeriod}
              helperText={touched.sellingPeriod && errors.sellingPeriod}
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
