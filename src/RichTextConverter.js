import React, { useState, useRef } from 'react';
import { convertToDiscordMarkdown } from './utils/markdownConverter';
import './RichTextConverter.css';

function RichTextConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const inputRef = useRef(null);

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  const handleConvert = () => {
    if (inputRef.current) {
      const richText = inputRef.current.innerHTML;
      const markdown = convertToDiscordMarkdown(richText);
      setOutputText(markdown);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  return (
    <div className="converter-container">
      <div className="input-section">
        <h2 className="column-heading neumorphic">Rich Text Input</h2>
        <button onClick={handleConvert} className="neumorphic-button">Convert to Markdown</button>
        <div
          ref={inputRef}
          contentEditable
          onPaste={handlePaste}
          className="editable-div neumorphic"
          placeholder="Paste your rich text here..."
        />
      </div>
      <div className="output-section">
        <h2 className="column-heading neumorphic">Markdown Output</h2>
        <button onClick={handleCopy} className="neumorphic-button">Copy Output</button>
        <pre className="output-pre neumorphic">
          <code>{outputText}</code>
        </pre>
      </div>
    </div>
  );
}

export default RichTextConverter;