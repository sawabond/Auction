import { Grid, LinearProgress } from '@material-ui/core';
import { FileHeader } from './FileHeader';

export interface SingleFileUploadField {
  file: File;
  onDelete: (file: File) => void;
  onUpload: (file: File, url: string) => void;
}

export function SingleFileUploadField({
  file,
  onDelete,
}: SingleFileUploadField) {

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <LinearProgress variant="determinate" value={100} />
    </Grid>
  );
}
