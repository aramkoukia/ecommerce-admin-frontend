import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const ImageUpload = ({ onChange, isSingleImage, existingImages }) => {
  const [pictures, setPictures] = useState([]);

  const onDrop = (picture) => {
    onChange(picture);
    setPictures([...pictures, picture]);
  };

  return (
    <ImageUploader
      withIcon
      withPreview
      singleImage={isSingleImage}
      onChange={onDrop}
      imgExtension={['.jpg', '.gif', '.png']}
      maxFileSize={52428800}
      label="Max file size: 50 MB. Accepted: jpg, gif, png"
      defaultImages={existingImages}
    />
  );
};

export default ImageUpload;
