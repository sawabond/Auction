import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MultipleFileUploadField from '../../components/elements/Drag and drop/MultipleFileUploadField';
import addAuctionItem from './services/editAuctionItem';
import getAuctionItem from './services/getAuctionItem';
import downloadFileFromS3AndMakeFile from './services/downloadFileFromS3AndMakeFile';

function EditAuctionItemPage() {
  const navigate = useNavigate();
  const { auctionId, auctionItemId } = useParams();
  const [itemPhotos, setUploadedPhotos] = useState<any>([]);
  const [initialValues, setInitialValues] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const currentAuctionItemData = await getAuctionItem(
          auctionId,
          auctionItemId,
          t
        );
        console.log('Fetched auction item data:', currentAuctionItemData);

        if (
          currentAuctionItemData &&
          Array.isArray(currentAuctionItemData.photos)
        ) {
          const photoFiles = await Promise.all(
            currentAuctionItemData.photos.map(
              async (photo: { photoUrl: string; name: string }) => {
                return downloadFileFromS3AndMakeFile(
                  photo.photoUrl,
                  photo.name,
                  t
                );
              }
            )
          );
          setUploadedPhotos(photoFiles);
          console.log('Updated auction item photos:', photoFiles);
          setInitialValues({
            ...currentAuctionItemData,
            itemPhotos: photoFiles,
          });
        } else {
          console.error(
            'Auction items not found or not in correct format in fetched data'
          );
        }
      } catch (error) {
        console.error('Error fetching auction:', error);
      }
    };

    fetchAuctionData();
  }, []);

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

  const mutation = useMutation((values: any) => addAuctionItem(values, auctionId, t), {
    onSuccess: () => {
      toast.success(t('auctionItemSavedSuccess'));
    },
    onError: (error: any) => {
      toast.error(`${t('auctionItemSavedError')}: ${error.message}`);
    },
  });

  const handleFilesChange = (files: File[]) => {
    setUploadedPhotos(files);
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('id', auctionItemId || '');
    formData.append('startingPrice', values.startingPrice);
    formData.append('minimalBid', values.minimalBid);
    formData.append('name', values.name);
    formData.append('description', values.description);

    for (let index = 0; index < itemPhotos.length; index++) {
      const file = itemPhotos[index];

      if (file.name.match(/(.jpg|.jpeg|.png|.jfif|.pjpeg|.pjp)$/gm)) {
        formData.append(`photos[${index}]`, file);
      } else {
        return;
      }
    }
    try {
      await mutation.mutateAsync({ formData, auctionId, t });

      navigate(`/auctions/${auctionId}/edit`);
    } catch (error: any) {
      console.error('Error while creating auction item:', error.message);
    }
  };

  if (!initialValues) {
    return <div>{t('loadingAuction')}</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <div className="flex flex-row justify-center items-center h-screen gap-6">
          <Form className="flex flex-col w-4/12 shadow p-8 rounded">
            <h1 className="text-3xl font-bold mb-4">
              {t('editAuctionItemTitle')}
            </h1>
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

            <Button type="submit" name="button_add_one">
              {t('save')}
            </Button>
          </Form>
          <MultipleFileUploadField
            name="photos"
            onFilesChange={handleFilesChange}
            photos={itemPhotos}
          />
        </div>
      )}
    </Formik>
  );
}

export default EditAuctionItemPage;
