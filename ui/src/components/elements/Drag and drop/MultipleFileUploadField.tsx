import { Grid } from '@material-ui/core';
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
}

function MultipleFileUploadField({ name, onFilesChange, isFormSubmitted = false, photos = []}: { name: string; onFilesChange: Function, isFormSubmitted?: boolean, photos?: File[] }) {
  const [files, setFiles] = useState<UploadableFile[]>(photos.map(file => ({ id: getNewId(), file, errors: [] })));

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

  const handleUpload = (file: File) => {
    if (file.name.match("(.jpg|.png)$"))
      setFiles(prevFiles => prevFiles.map(fileWrapper => fileWrapper.file === file ? { ...fileWrapper, file } : fileWrapper));
  };

  const handleDelete = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(fileWrapper => fileWrapper.file !== file));
  };

  const acceptImage: Accept = {
    'image/png': ['.png'],
    'image/jpeg': ['.jpg'],
    //'image/x-citrix-jpeg': ['.jpeg'],
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptImage 
  });

  return (
    <div>
      <Grid item>
      <div {...getRootProps({ className: "border-2 border-dashed border-purple-500 rounded flex items-center justify-center bg-white h-20 outline-none" })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </Grid>
      <div className="grid grid-cols-3 gap-4 mx-auto my-4 overflow-auto h-full max-h-[52vh]">
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
      </div>
    </div>
  );
}

export default MultipleFileUploadField;
