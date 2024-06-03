import { Button, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export interface FileHeaderProps {
  file: File;
  onDelete: (file: File) => void;
}

export function FileHeader({ file, onDelete }: FileHeaderProps) {
  const { t } = useTranslation();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Button size="small" onClick={() => onDelete(file)}>
          {t('delete')}
        </Button>
      </Grid>
    </Grid>
  );
}