import { useState, useEffect, ReactNode } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Fab
} from '@mui/material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getAuction from './services/getAuction';
import { AuctionType } from '../../components/enums/AuctionType';
import editAuction from './services/editAuction';
import SearchInput from '../../components/elements/Search/Search';
import ItemList from './components/ItemList/ItemList';
import deleteAuctionItem from './services/deleteAuctionItem';
import AddIcon from '@mui/icons-material/Add';

const auctionTypeOptions = Object.keys(AuctionType)
  .filter((key) => !Number.isNaN(Number(key)))
  .map((key) => ({
    value: Number(key),
    label: AuctionType[key as keyof typeof AuctionType],
  }));

function EditAuctionPage() {
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  const auctionId = currentUrl.split('/')[4];
  const [allAuctionItems, setAuctionItems] = useState<any>([]);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const currentAuctionData = await getAuction(auctionId);
        console.log("Fetched auction data:", currentAuctionData);
  
        if (currentAuctionData && Array.isArray(currentAuctionData.auctionItems)) {
          setAuctionItems(currentAuctionData.auctionItems);
          console.log("Updated auction items:", currentAuctionData.auctionItems);
          console.log(allAuctionItems)
        } else {
          console.error("Auction items not found or not in correct format in fetched data");
        }
  
        setInitialValues({
          ...currentAuctionData,
          startTime: currentAuctionData.startTime.slice(0, 16),
          auctionType: currentAuctionData.auctionType || AuctionType.English,
          allAuctionItems: currentAuctionData.auctionItems
        });
      } catch (error) {
        console.error('Error fetching auction:', error);
      }
    };
  
    fetchAuctionData();
  }, [auctionId]);

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

  const mutation = useMutation(editAuction, {
    onSuccess: () => {
      toast.success('Auction edited successfully!');
      navigate('/my-auctions');
    },
    onError: (error : any) => {
      toast.error(`Error while editing auction: ${error.message}`);
    },
  });

  const handleClick = () => {
    navigate(`/auction/${auctionId}/add-auction-item`);
  };

  const handleDelete = async (auctionItemId: string) => {
    try {
      // Delete the auction item
      await deleteAuctionItem(auctionId, auctionItemId);
  
      // Update the auction items state by filtering out the deleted item
      const updatedAuctionItems = allAuctionItems.filter((item: { id: string; }) => item.id !== auctionItemId);
      setAuctionItems(updatedAuctionItems);
  
      // Trigger the mutation to update the backend
      //mutation.mutate();
    } catch (error) {
      console.error('Error deleting auction item:', error);
    }
  };

  const handleSubmit = (values : any) => {
    const dateObject = new Date(values.startTime);

    // Add seconds and milliseconds to the date
    dateObject.setSeconds(12);
    dateObject.setMilliseconds(323);
  
    // Convert the Date object to an ISO string in UTC format
    const isoString = dateObject.toISOString();
  
    // Update the startTime value in the values object
    const updatedValues = {
      ...values,
      startTime: isoString,
    };
  
    // Pass the updated values to mutation.mutate
    mutation.mutate(updatedValues);
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
      {({ values, errors, touched, handleChange }) => (
        <div className="flex flex-row justify-center items-center h-screen">
            <Form className="flex flex-col w-4/12 shadow p-8 rounded">
            <h1 className="text-3xl font-bold mb-4">Edit Auction</h1>
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
                <div>{errors.auctionType as ReactNode}</div> 
              )}            
              <Button type="submit">Save</Button>
              
            </Form>
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center">
                <Fab size="small" color="primary" aria-label="add" onClick={handleClick}>
                  <AddIcon />
                </Fab>
                <div className="w-full max-w-full">
                  <SearchInput />
                </div>
              </div>
              {false ? (
                <div>Loading...</div>
              ) : (
                <ItemList auctionItems={allAuctionItems} onDelete={handleDelete} />
              )}
            </div>
          </div>
      )}
    </Formik>
  );
}

export default EditAuctionPage;
