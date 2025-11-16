import React, { useState, useEffect } from 'react'; // Corrected import
import { useNavigate } from 'react-router-dom';

const EmojiLogin = () => {
  const emojiOptions = ['😀', '😂', '🥰'];
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [isHovered, setIsHovered] = useState(false); // Corrected state declaration
  const navigate = useNavigate();

  const emojiMap = {
    '😀': '1',
    '😂': '2',
    '🥰': '3',
  };

  const handleEmojiClick = (emoji) => {
    if (selectedEmojis.length < 8) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handleBackspace = (event) => {
    if (event.key === 'Backspace' && selectedEmojis.length > 0) {
      setSelectedEmojis(selectedEmojis.slice(0, -1));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleBackspace);
    return () => {
      window.removeEventListener('keydown', handleBackspace);
    };
  }, [selectedEmojis]);

  const handleSubmit = async () => {
    const emojiSequence = selectedEmojis.map(emoji => emojiMap[emoji]).join('');
    try {
      const response = await fetch('/api/emoji-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emojiSequence }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'An error occurred during login.');
      }
      else{navigate('/ClientPage');}
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (<div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '20px',
    paddingBottom: '20px',
    gap: '20px',
    minHeight: 'calc(100vh - var(--header-footer-height))'
  }}>
         <br></br>
         <br></br>

      <br></br>
      {/* Emoji placeholders */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>

        {[...Array(8)].map((_, index) => (
          
          <div key={index} style={{
            padding: '30px',
            fontSize: '50px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50px',
            height: '50px',
            border: '10px solid #6a5870',
            backgroundColor: 'white',
            margin: '5px',
            borderRadius: '15px',
          }}>
            {selectedEmojis[index]}
          </div>
        ))}
      </div>
      {/* Emoji selection buttons */}
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
        {emojiOptions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            style={{ padding: '10px', fontSize: '90px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {emoji}
          </button>
        ))}
      </div>
      {/* Login button */}
      <button
        onClick={handleSubmit}
        disabled={selectedEmojis.length < 6}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          backgroundColor: isHovered ? '#6a5870' : '#deafa1', // Change color on hover
          color: '#f4ecdc',
          padding: '15px 30px',
          fontSize: '1.5rem',
          border: 'none',
          borderRadius: '30px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background-color 0.3s ease',
          width: '250px',
          marginBottom: '20px',
        }}
      >
        <img src="./loginpic.png" alt="Login" style={{ marginRight: '10px', height: '50px' }} />
        Log In
      </button>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

    </div>
  );
};

export default EmojiLogin;
