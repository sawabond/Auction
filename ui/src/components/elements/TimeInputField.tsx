import { TextField } from "@material-ui/core";
import { useField } from "formik";


const TimeInputField = ({ label, ...props }: any) => {
    const [field, meta, helpers] = useField(props);
    const { value } = meta;
    const { setValue } = helpers;
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let { value } = e.target;
      // Remove all non-numeric characters except colons
      value = value.replace(/[^\d:]/g, '');
      
      // Add colons at appropriate positions
      if (value.length > 2 && value[2] !== ':') {
        value = value.slice(0, 2) + ':' + value.slice(2);
      }
      if (value.length > 5 && value[5] !== ':') {
        value = value.slice(0, 5) + ':' + value.slice(5);
      }
  
      // Allow only valid time format HH:MM:SS
      const regex = /^\d{0,2}(:\d{0,2})?(:\d{0,2})?$/;
      if (regex.test(value)) {
        setValue(value);
      }
    };
  
    return (
      <TextField
        {...field}
        {...props}
        value={value}
        onChange={handleChange}
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
      />
    );
  };

  export default TimeInputField;