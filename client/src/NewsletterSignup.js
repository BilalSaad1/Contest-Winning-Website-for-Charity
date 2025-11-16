import React, { useState } from 'react';
import "./UploadPage.css";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // New state to track the type of status

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage('Please select a file first!');
      setStatusType('failed'); // Use 'failed' type for error message
      return;
    }

    setStatusMessage('Uploading...');
    setStatusType('uploading'); // Use 'uploading' type for uploading message

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('subject', subject);
    formData.append('text', text);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStatusMessage('PDF uploaded and email sent!');
        setStatusType('success'); // Use 'success' type for success message
      } else {
        setStatusMessage('Failed to upload PDF!');
        setStatusType('failed'); // Keep 'failed' type for error message
      }
    } catch (error) {
      console.log('Error uploading PDF:', error);
      setStatusMessage('Failed to upload PDF!');
      setStatusType('failed'); // Keep 'failed' type for error message
    }
  };

  return (
    <div className="UploadPage">
      <h1>Upload a PDF to Send in Newsletter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject</label>
          <input type="text" value={subject} onChange={handleSubjectChange} />
        </div>
        <div>
          <label>Body</label>
          <textarea value={text} onChange={handleTextChange} />
        </div>
        <div>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload and Send</button>
        {/* Conditionally render the status message with different classes */}
        <div className={`statusMessage ${statusType}`}>{statusMessage}</div>
      </form>
    </div>
  );
}

export default UploadPage;
