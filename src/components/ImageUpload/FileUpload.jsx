import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const FileUpload = ({ onChange, isSingleImage, existingFiles }) => {
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
      imgExtension={['.pdf', '.jpg', '.png', '.gif', '.docx', '.doc', '.xls', '.xlsx']}
      maxFileSize={52428800}
      label="Max file size: 50 MB. Accepted: pdf, docx, doc, jpg, gif, png, docx, xls, xlsx'"
      defaultImages={existingFiles}
    />
  );
};

export default FileUpload;
