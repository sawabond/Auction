import { Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const ItemFilterComponent = ({ applyFilters, initialValues } : any) => {
  const validationSchema = Yup.object().shape({
    search: Yup.string().nullable(),
    minPrice: Yup.number().positive().nullable(),
    maxPrice: Yup.number().positive().nullable()
  });

  const { t } = useTranslation();

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
            label={t('search')}
            type="text"
            fullWidth
          />
          <Field
            as={TextField}
            name="minPrice"
            label={t('minPrice')}
            type="number"
            fullWidth
          />
          <Field
            as={TextField}
            name="maxPrice"
            label={t('maxPrice')}
            type="number"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            {t('applyFilters')}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default ItemFilterComponent;
