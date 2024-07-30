import React, { useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import { storage, functions } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      setUploading(true);
      setError(null);
      setResult(null);
      console.log('Starting upload process');
      const storageRef = ref(storage, `statements/${image.name}`);
      try {
        console.log('Uploading image to Firebase Storage');
        await uploadBytes(storageRef, image);
        console.log('Image uploaded successfully');
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Download URL obtained:', downloadURL);

        console.log('Calling processImage Cloud Function');
        const processImage = httpsCallable(functions, 'processImage');
        const response = await processImage({ imageUrl: downloadURL });
        console.log('Cloud Function response:', response);

        setResult(response.data);
        setUploading(false);
        setImage(null);
      } catch (error) {
        console.error('Error uploading or processing image:', error);
        setError(error.message);
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Choose Image
        </Button>
      </label>
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        disabled={!image || uploading}
        style={{ marginLeft: 10 }}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {result && <Typography>{JSON.stringify(result)}</Typography>}
    </div>
  );
}

export default ImageUpload;