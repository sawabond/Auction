import { Grid, LinearProgress } from '@material-ui/core';
import { FileHeader } from './FileHeader';
import { Card, CardMedia } from '@mui/material';

export interface SingleFileUploadField {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File) => void;
}

export function SingleFileUploadField({
  file,
  onDelete,
}: SingleFileUploadField) {

  console.log(file)
  return (
    <Card sx={{ width: 160 }}>
      <Grid item>

        <CardMedia
          component="img"
          image={URL.createObjectURL(file)}
          alt="Your Image"
          className="w-32 h-32 object-cover"
        />

        <FileHeader file={file} onDelete={onDelete} />
        <LinearProgress variant="determinate" value={100} />
      </Grid>
    </Card>
  );
}
