// EditEventModal.js
import React, { useState, useEffect } from 'react';

function EditEventModal({ isOpen, onClose, onUpdate, onDelete, event }) {
  // Helper function to format dates for datetime-local input
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().slice(0, 16); // Returns the date in YYYY-MM-DDTHH:MM format
  };

  const [title, setTitle] = useState(event.title);
  const [startTime, setStartTime] = useState(formatDateForInput(event.start));
  const [endTime, setEndTime] = useState(formatDateForInput(event.end));
  const [userID, setUserID]=useState(event.userID)

  // Ensure we update state if the event prop changes, such as when a different event is selected to edit
  useEffect(() => {
    setTitle(event.title);
    setStartTime(formatDateForInput(event.start));
    setEndTime(formatDateForInput(event.end));
  }, [event]);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Edit Event</h2>
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
            setUserID(e.target.value);
          }}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          style={styles.input}
        />
        <button onClick={() => onUpdate(event.id, title, startTime, endTime)} style={styles.button}>Update</button>
        <button onClick={() => onDelete(event.id)} style={styles.button}>Delete</button>
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
    zIndex: 1000,
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
  }
};

export default EditEventModal;
