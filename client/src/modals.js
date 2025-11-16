import React, { useState, useEffect } from 'react';

function Modal({ isOpen, onClose, onSave, date }) {
  const appendTimeIfNeeded = (baseDate, time) => {
    return baseDate.includes('T') ? baseDate.substring(0, 16) : baseDate + 'T' + time;
  };

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState(() => appendTimeIfNeeded(date, '00:00'));
  const [endTime, setEndTime] = useState(() => appendTimeIfNeeded(date, '01:00'));
  const [errorMessage, setErrorMessage] = useState(''); // State to hold the error message
  const [userID, setUserID]=useState('')

  // Ensure that startTime and endTime are updated if the date prop changes
  useEffect(() => {
    setStartTime(appendTimeIfNeeded(date, '00:00'));
    setEndTime(appendTimeIfNeeded(date, '01:00'));
  }, [date]);



  const handleSaveClick = () => {
    if (new Date(startTime) >= new Date(endTime)) {
      setErrorMessage('End time must be later than start time.'); // Set the error message
      return; // Prevent onSave from being called
    }
    onSave(title, userID, startTime, endTime);
    setErrorMessage(''); // Clear any error message on successful save
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Add Event</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
<input
          type="text"
          placeholder='User ID'
          value={userID}
          onChange={(e) => {
            setErrorMessage(''); // Clear error message when changing time
            setUserID(e.target.value);
          }}
          style={styles.input}
        />

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => {
            setErrorMessage(''); // Clear error message when changing time
            setStartTime(e.target.value);
          }}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => {
            setErrorMessage(''); // Clear error message when changing time
            setEndTime(e.target.value);
          }}
          style={styles.input}
        />
        {errorMessage && <p style={{color: 'red', textAlign: 'center', fontSize:"13px" }}>{errorMessage}</p>}
        <button onClick={handleSaveClick} style={styles.button}>Save</button>
        <button onClick={onClose} style={styles.button}>Cancel</button>
      </div>
    </div>
  );
}
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure the overlay is on top
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '90%',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: "#6a5870",
    fontfamily: 'Montserrat', // Added the sans-serif as a fallback
    fontSize: '0.95rem', // Updated font size
    color: 'var(--champagne)', // Using CSS variable for color
  },
};

export default Modal;
