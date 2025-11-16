import React, { useState, useEffect } from 'react';
import './AddClient.css'; // Assuming the CSS is saved in AddClient.css

const emojiMap = {
  '😀': '1',
  '😂': '2',
  '🥰': '3',
};

function AddClient() {
  const [user, setUser] = useState(null);
  const [clientUsername, setClientUsername] = useState('');
  const [passwordEmojis, setPasswordEmojis] = useState([]);
  const [clients, setClients] = useState([]); // New state for storing clients
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('/api/usercheck')
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setIsLoading(false);
        // Fetch clients after getting the user
        fetchClients(data.username);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        setIsLoading(false);
      });
  }, []);



  
  // Function to fetch clients
  const fetchClients = (username) => {
    fetch(`/api/getClients/${username}`) // Update endpoint as necessary
      .then((response) => response.json())
      .then((data) => setClients(data.clients))
      .catch((error) => console.error('Error fetching clients:', error));
  };


  const handleEmojiClick = (emoji) => {
    if (passwordEmojis.length<8) {
      setPasswordEmojis([...passwordEmojis, emoji]);
    }
  };

  const convertEmojisToNumbers = (emojis) => emojis.map((emoji) => emojiMap[emoji]).join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const convertedPassword = convertEmojisToNumbers(passwordEmojis);

    if (!clientUsername || passwordEmojis.length === 0 || passwordEmojis.length!=8) {
        setSuccessMessage('Please fill all fields and Password must be 8 digits'); // You can also replace this with in-component messaging if preferred
      return;
    }

    // Replace with your actual fetch request
    fetch('/api/addClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        clientUsername,
        clientPassword: convertedPassword,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        // Handle HTTP-level errors
        return response.json().then((data) => Promise.reject(data.message));
      }
      return response.json();
    })
    .then((data) => {
      setSuccessMessage('Client added successfully'); // Update success message state
      fetchClients(user.username); // Refresh client list
      // Optional: Clear the form fields
      setClientUsername('');
      setPasswordEmojis([]);
    })
    .catch((errorMessage) => {
      console.error('Error adding client:', errorMessage);
      setSuccessMessage(errorMessage); // Use the errorMessage from the server
    });
    
  };
  
  const handleEmojiDelete = () => {
    setPasswordEmojis(passwordEmojis.slice(0, -1)); // Removes the last emoji from the array
  };
  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;
  // The rest of the component remains unchanged...

  return (
    <div className="formApp_container">
    <h2>Add Loved One</h2>
        <label className="formApp_label" htmlFor="clientUsername">Client Username:</label>
        <input
          className="formApp_input"
          type="text"
          value={clientUsername}
          onChange={(e) => setClientUsername(e.target.value)}
          placeholder="Client Username"
          id="clientUsername"
          required
        />
      <label className="formApp_label" htmlFor="password">Password:</label>
      <div
        className="formApp_input" // Using the same class for styling
        id="password"
        role="textbox" // This is important for accessibility reasons
        aria-multiline="false" // Emoji password should be a single line
        onInput={(e) => setPasswordEmojis([...e.currentTarget.textContent.trim()])}
        style={{ display: 'inline-block', minWidth: '410px' , maxWidth:'410px', minHeight:"48px"}} // Ensures the div behaves like an input
      >
        {passwordEmojis.length>0 && (passwordEmojis)}
        {!passwordEmojis.length>0 && ("Participant Login")}
      </div>
        <div className="formApp_label">
          {Object.keys(emojiMap).map((emoji) => (
            <button type="button" className="formApp_button" key={emoji} onClick={() => handleEmojiClick(emoji)}>
              {emoji}
            </button>

          ))}
        <button type="button" className="formApp_button" onClick={handleEmojiDelete}>Delete Last Emoji</button>
        </div>
        <button type="submit" className="formApp_uploadButton" onClick={handleSubmit}>Add Loved One</button>
    {clients.length > 0 && (
      <div className="formApp_htmlContent">
        <h3>Loved Ones:</h3>
        <ul>
          {clients.map((client, index) => (
            <li key={index}>{client[0]} {/* Display client username */}</li>
          ))}
        </ul>
      </div>
    )}
    {successMessage && <p>{successMessage}</p>}
  </div>
  );  
}

export default AddClient;





