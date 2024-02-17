import { Formik, Form, Field } from 'formik';
import { TextField, Button } from '@material-ui/core';
import * as yup from 'yup';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import MultipleFileUploadField from '../../components/elements/Drag and drop/MultipleFileUploadField';
import { useEffect, useState } from 'react';
import addAuctionItem from './services/editAuctionItem';
import { useNavigate, useParams } from 'react-router-dom';
import getAuctionItem from './services/getAuctionItem';
import downloadFileFromS3AndMakeFile from './services/downloadFileFromS3AndMakeFile';

function EditAuctionItemPage() {
  const navigate = useNavigate();  
  const { auctionId, auctionItemId } = useParams();
  const [itemPhotos, setUploadedPhotos] = useState<any>([]);
  const [initialValues, setInitialValues] = useState(null);
  
  useEffect(() => {
    const fetchAuctionData = async () => {
        try {
            const currentAuctionItemData = await getAuctionItem({ auctionId, auctionItemId });
            console.log("Fetched auction item data:", currentAuctionItemData);

            if (currentAuctionItemData && Array.isArray(currentAuctionItemData.photos)) {
                const photoFiles = await Promise.all(currentAuctionItemData.photos.map(async (photo: { photoUrl: string; name: string; }) => {
                    return await downloadFileFromS3AndMakeFile(photo.photoUrl, photo.name);
                }));
                setUploadedPhotos(photoFiles);
                console.log("Updated auction item photos:", photoFiles);
                setInitialValues({
                    ...currentAuctionItemData,
                    itemPhotos: photoFiles
                });
            } else {
                console.error("Auction items not found or not in correct format in fetched data");
            }
        } catch (error) {
            console.error('Error fetching auction:', error);
        }
    };

    fetchAuctionData();
}, []);
  
  useEffect(() => {
    console.log(itemPhotos); // Log the updated itemPhotos
  }, [itemPhotos]);

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
      toast.success('Auction item saved successfully!');
    },
    onError: (error: any) => {
      toast.error(`Error while creating auction: ${error.message}`);
    },
  });

  const handleFilesChange = (files: File[]) => {
    setUploadedPhotos(files);
  };
  
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("id", auctionItemId || "");
    formData.append("startingPrice", values.startingPrice);
    formData.append("minimalBid", values.minimalBid);
    formData.append("name", values.name);
    formData.append("description", values.description);
  
    for (let index = 0; index < itemPhotos.length; index++) {
      const file = itemPhotos[index];
      
      if (file.name.match(/(.jpg|.jpeg|.png|.jfif|.pjpeg|.pjp)$/gm)) {
        formData.append(`photos[${index}]`, file);
      } else {
        return;
      }
    }
    try {
      await mutation.mutateAsync({formData, auctionId})
      
        navigate(`/auctions/${auctionId}/edit`);
    } catch (error: any) {
      console.error('Error while creating auction item:', error.message);
    } finally {

    }
  };

  if (!initialValues) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <div className="flex flex-row justify-center items-center h-screen">

          <Form className="flex flex-col w-6/12 shadow p-8 rounded">
            <h1 className="text-3xl font-bold mb-4">Edit Auction Item</h1>
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
          
            <Button type="submit" name="button_add_one">Save</Button>
          </Form>
          <MultipleFileUploadField name="photos" onFilesChange={handleFilesChange} photos={itemPhotos}/> 
        </div>
        
      )}
    </Formik>
  );
}

export default EditAuctionItemPage;
