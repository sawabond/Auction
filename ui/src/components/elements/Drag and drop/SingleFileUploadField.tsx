import { Grid, LinearProgress } from '@material-ui/core';
import { FileHeader } from './FileHeader';
import { Card, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface SingleFileUploadField {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File) => void;
}

export function SingleFileUploadField({
  file,
  onDelete,
}: SingleFileUploadField) {
  const { t } = useTranslation();
  return (
    <Card sx={{ width: 160 }}>
      <Grid item>
        <CardMedia
          component="img"
          image={URL.createObjectURL(file)}
          alt={t('yourImage')}
          className="w-32 h-32 object-cover"
        />
        <FileHeader file={file} onDelete={onDelete} />
        <LinearProgress variant="determinate" value={100} />
      </Grid>
    </Card>
  );
}
