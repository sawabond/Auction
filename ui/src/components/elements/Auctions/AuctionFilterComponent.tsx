import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AuctionFilterComponent = ({ applyFilters, initialValues } : any) => {
  const validationSchema = Yup.object().shape({
    nameStartsWith: Yup.string(),
    descriptionContains: Yup.string(),
  });

  const handleSubmit = (values : any) => {
    applyFilters(values);
  };

  return (
    <div className='flex flex-col items-center justify-start pt-6'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form className='grid gap-4'>
          <Field
            as={TextField}
            name="nameStartsWith"
            label="Search"
            type="text"
            fullWidth
          />
          <Field
            as={TextField}
            name="descriptionContains"
            label="Description"
            type="text"
            fullWidth
          />
          <label>
            <Field as={Checkbox} type="checkbox" name="onlyActive" />
            Show only active
          </label>
          <Button type="submit" variant="contained" color="primary">
            Apply Filters
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AuctionFilterComponent;
