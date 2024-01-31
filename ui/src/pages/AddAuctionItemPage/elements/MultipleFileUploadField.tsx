// MultipleFileUploadField.tsx
import { Grid, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { Accept, FileError, FileRejection, useDropzone } from 'react-dropzone';
import { SingleFileUploadField } from './SingleFileUploadField';
import { UploadError } from './UploadError';

let currentId = 0;

function getNewId() {
  return ++currentId;
}

interface UploadableFile {
  id: number;
  file: File;
  errors: FileError[];
  url?: string;
}

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    height: theme.spacing(10),
    outline: 'none',
  },
}));

function MultipleFileUploadField({ name, onFilesChange, isFormSubmitted }: { name: string; onFilesChange: Function, isFormSubmitted: boolean }) {
  const classes = useStyles();
  const [files, setFiles] = useState<UploadableFile[]>([]);

  useEffect(() => {
    onFilesChange(files.map(fileWrapper => fileWrapper.file));
  }, [files]);

  useEffect(() => {
    if (isFormSubmitted) {
      setFiles([]); // Clear files after form submission
    }
  }, [isFormSubmitted]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const mappedAccepted = acceptedFiles.map(file => ({ id: getNewId(), file, errors: [] }));
    const mappedRejected = rejectedFiles.map(({ file, errors }) => ({ id: getNewId(), file, errors }));
    setFiles(prevFiles => [...prevFiles, ...mappedAccepted, ...mappedRejected]);
    onFilesChange([...files, ...mappedAccepted]); // Notify parent component about new files
  }, [files, onFilesChange]);

  const handleUpload = (file: File, url: string) => {
    setFiles(prevFiles => prevFiles.map(fileWrapper => fileWrapper.file === file ? { ...fileWrapper, url } : fileWrapper));
  };

  const handleDelete = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(fileWrapper => fileWrapper.file !== file));
  };

  const acceptImage: Accept = {
    'image/*': ['*'],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptImage ,
    maxSize: 3000 * 1024, // 3000KB
  });

  return (
    <React.Fragment>
      <Grid item>
        <div {...getRootProps({ className: classes.dropzone })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </Grid>
      {files.map(fileWrapper => (
        <Grid item key={fileWrapper.id}>
          {fileWrapper.errors.length > 0 ? (
            <UploadError file={fileWrapper.file} errors={fileWrapper.errors} onDelete={() => handleDelete(fileWrapper.file)} />
          ) : (
            <SingleFileUploadField 
              file={fileWrapper.file} 
              onUpload={handleUpload} 
              onDelete={() => handleDelete(fileWrapper.file)} 
            />
          )}
        </Grid>
      ))}
    </React.Fragment>
  );
}

export default MultipleFileUploadField;
