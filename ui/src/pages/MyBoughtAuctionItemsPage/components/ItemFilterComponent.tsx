import { Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const ItemFilterComponent = ({ applyFilters, initialValues } : any) => {
  const validationSchema = Yup.object().shape({
    search: Yup.string().nullable(),
    minPrice: Yup.number().positive().nullable(),
    maxPrice: Yup.number().positive().nullable()
  });

  const handleSubmit = (values : any) => {
    applyFilters(values);
  };

  return (
    <div className='flex flex-col items-center justify-start pt-6'>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form className='grid gap-4'>
          <Field
            as={TextField}
            name="search"
            label="Search"
            type="text"
            fullWidth
          />
          <Field
            as={TextField}
            name="minPrice"
            label="Min Price"
            type="number"
            fullWidth
          />
          <Field
            as={TextField}
            name="maxPrice"
            label="Max Price"
            type="number"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Apply Filters
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ItemFilterComponent;
