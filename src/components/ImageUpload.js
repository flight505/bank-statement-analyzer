import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { processImage } from '../services/claude_service';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      setUploading(true);
      const storageRef = ref(storage, `statements/${image.name}`);
      try {
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Process image with Claude 3.5 Sonnet
        const result = await processImage(downloadURL);
        
        console.log('OCR Result:', result);
        
        setUploading(false);
        setImage(null);
      } catch (error) {
        console.error('Error uploading image:', error);
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
    </div>
  );
}

export default ImageUpload;
