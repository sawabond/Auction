import { Button, Checkbox, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const AuctionFilterComponent = ({ applyFilters, initialValues }: any) => {
  const validationSchema = Yup.object().shape({
    nameStartsWith: Yup.string(),
    descriptionContains: Yup.string(),
  });
  const { t } = useTranslation();
  const handleSubmit = (values: any) => {
    applyFilters(values);
  };

  return (
    <div className="flex flex-col items-center justify-start pt-6">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form className="grid gap-4">
          <Field
            as={TextField}
            name="nameStartsWith"
            label={t('search')}
            type="text"
            fullWidth
          />
          <Field
            as={TextField}
            name="descriptionContains"
            label={t('description')}
            type="text"
            fullWidth
          />
          <label>
            <Field as={Checkbox} type="checkbox" name="onlyActive" />
            {t('onlyActive')}
          </label>
          <Button type="submit" variant="contained" color="primary">
            {t('applyFilters')}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default AuctionFilterComponent;
