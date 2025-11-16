import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ClientPage.css'; // Importing the CSS file for styling
import GamesImage from './game.png'; // Importing the Games image
import ChatImage from './chat.png'; // Importing the Chat image

function ClientPage({ isTextToSpeechEnabled }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const speakText = (text) => {
    if (isTextToSpeechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/usercheck');
        if (response.ok) {
          const data = await response.json();
          console.log(data); // Log to see the structure
          const isClient = data[data.length-1]; // Assuming the server can send this structure
          if (isClient) {
            setUser({ name: data[0], emojiSequence: data[1], isClient }); // Assuming the first two elements are name and emojiSequence
          } else {
            navigate('/emoji-login-page');
          }
        } else {
          throw new Error('Failed to authenticate');
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
        navigate('/emoji-login-page');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserStatus();
  }, [navigate]);
  

  if (isLoading) {
    return <p>Loading...</p>; // Show loading state while checking
  }

  return (
    <div className="container">
      <a href="/games">
        <div className="square" id="games"  onMouseEnter={() => speakText("Games")}>
          <h1>Games</h1>
          <img src={GamesImage} alt="Games" />
        </div>
      </a>
      <a href="/chat">
        <div className="square" id='chat'  onMouseEnter={() => speakText("Discussion Room")}>
          <h1>Discussion</h1>
          <img src={ChatImage} alt="Discussion Form" />
        </div>
      </a>
    </div>
  );
}

export default ClientPage;
