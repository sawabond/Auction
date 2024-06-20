async function downloadFileFromS3AndMakeFile(url: string, fileName: string, t: any): Promise<File> {
    // Step 1: Fetch the file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(t('networkError'));
    }
  
    // Step 2: Convert to Blob
    const blob = await response.blob();
  
    // Step 3: Create a File object
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

export default downloadFileFromS3AndMakeFile;