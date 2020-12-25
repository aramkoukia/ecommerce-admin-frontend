import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const FileUpload = ({ onChange, singleImage }) => {
  const [pictures, setPictures] = useState([]);

  const onDrop = (picture) => {
    onChange(picture);
    setPictures([...pictures, picture]);
  };
  return (
    <ImageUploader
      withIcon
      withPreview
      singleImage
      onChange={onDrop}
      imgExtension={['.pdf', '.jpg', '.gif', '.png', '.gif']}
      maxFileSize={5242880}
    />
  );
};

export default FileUpload;
