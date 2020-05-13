import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';

const ImageUpload = () => {
  const [pictures, setPictures] = useState([]);

  function onDrop(picture) {
    setPictures({
      pictures: pictures.concat(picture),
    });
  }

  return (
    <ImageUploader
      withIcon
      buttonText="Choose images"
      onChange={onDrop}
      imgExtension={['.jpg', '.gif', '.png', '.gif']}
      maxFileSize={5242880}
    />
  );
};

export default ImageUpload;
