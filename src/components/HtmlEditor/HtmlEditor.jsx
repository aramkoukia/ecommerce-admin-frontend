import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';

const HtmlEditor = ({}) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      // tabIndex={1} // tabIndex of textarea
      // preferred to use only this option to update the content for performance reasons
      onBlur={(newContent) => setContent(newContent)}
      onChange={(newContent) => {}}
    />
  );
};

export default HtmlEditor;
