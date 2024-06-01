import { useState, useEffect, ReactNode } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Fab } from '@mui/material';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import getAuction from './services/getAuction';
import editAuction from './services/editAuction';
import SearchInput from '../../components/elements/Search/Search';
import ItemListEdit from './components/ItemListEdit/ItemListEdit';
import deleteAuctionItem from './services/deleteAuctionItem';
import AddIcon from '@mui/icons-material/Add';

function EditAuctionPage() {
  const navigate = useNavigate();
  const { auctionId } = useParams();
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
          auctionType: currentAuctionData.auctionType,
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
    startTime: Yup.string().required('Start time is required')
  });

  const mutation = useMutation(editAuction, {
    onSuccess: () => {
      toast.success('Auction edited successfully!');
      navigate('/auctions/my-auctions');
    },
    onError: (error : any) => {
      toast.error(`Error while editing auction: ${error.message}`);
    },
  });

  const handleClick = () => {
    navigate(`/auctions/${auctionId}/items/add`);
  };

  const handleDelete = async (auctionItemId: string) => {
    try {
      await deleteAuctionItem(auctionId, auctionItemId);
      const updatedAuctionItems = allAuctionItems.filter(
        (item: { id: string; }) => item.id !== auctionItemId);

      setAuctionItems(updatedAuctionItems);
    } catch (error) {
      console.error('Error deleting auction item:', error);
    }
  };

  const handleMove = async (auctionItemId: string) => {
    navigate(`/auctions/${auctionId}/items/${auctionItemId}/edit`);
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
  
    mutation.mutate(updatedValues);
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ 
        values, 
        errors, 
        touched, 
        handleChange 
      }) => (
        <div className="flex flex-row justify-center items-center h-svh gap-6">
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
              <Button type="submit">Save</Button>
            </Form>
            <div className="flex flex-col">
              <div className="flex flex-row justify-center items-center">
                <Fab 
                  className="bg-violet-950 text-white rounded" 
                  size="small" 
                  color="primary" 
                  aria-label="add" 
                  onClick={handleClick}
                >
                  <AddIcon />
                </Fab>
                <div className="w-full max-w-full">
                  <SearchInput />
                </div>
              </div>
              <ItemListEdit 
                auctionItems={allAuctionItems} 
                onMove={handleMove} 
                onDelete={handleDelete} 
              />
            </div>
          </div>
      )}
    </Formik>
  );
}

export default EditAuctionPage;
