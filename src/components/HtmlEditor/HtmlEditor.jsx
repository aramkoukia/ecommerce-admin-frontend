import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';

const HtmlEditor = ({ value, onBlur }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    height: '500px',
  };

  function updateContent(newContent) {
    setContent(newContent);
    onBlur(newContent);
  }

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={config}
      // tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => updateContent(newContent)}
    />
  );
};

export default HtmlEditor;
