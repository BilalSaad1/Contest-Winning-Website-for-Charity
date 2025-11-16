import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ChatPage.css";
import useRecorder  from './useRecorder';
import sendLogo from './send-icon.png';
import recordLogo from './recordLogo.png';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState({ name: '', isClient: false });
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { audioURL, isRecording, startRecording, stopRecording, clearAudioURL } = useRecorder();

    const messagesEndRef = useRef(null);
    const toggleRecording = () => {
        isRecording ? stopRecording() : startRecording();
    };
// Define fetchMessages outside so it can be reused
const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        return; // Avoid setting the messages state with invalid data
      }
  
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
      
    useEffect(() => {
        const fetchUserStatus = async () => {
            try {
                const response = await fetch('/api/usercheck');
                console.log(response);
                if (response.ok) {
                    const userData = await response.json();
                    if (userData[userData.length-1]) {
                        setUser({ name: userData[0], isClient: true });
                    } else {
                        navigate('/emoji-login-page');
                        console.log(userData);
                    }
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('Failed to fetch user status:', error);
                navigate('/emoji-login');

            } finally {
                setIsLoading(false);
            }
        };

        fetchUserStatus();
    }, [navigate]);

    const sendMessage = async () => {
        if (!(audioURL || message.trim())) return;
    
        const newMessage = {
          sender: user.name, // Adjusted based on your user management logic
          content: audioURL || message,
          type: audioURL ? 'audio' : 'text',
        };
    
        try {
          const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
          });
    
          if (!response.ok) throw new Error('Failed to send message');
    
          // Clear the current audio URL and message input after sending
          if (clearAudioURL) clearAudioURL();
          setMessage('');
    
          // Fetch messages again to include the new message
          await fetchMessages();
        } catch (error) {
          console.error('Failed to send message:', error);
        }
    };
    
      
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-container ${msg.sender === user.name ? 'right' : ''}`}>
                        {/* Display sender's name */}
                        <p className="sender-name">{msg.sender}</p>
                        {msg.type === 'text' ? (
                            <p className="message text-message">{msg.content}</p>
                        ) : (
                            <audio controls src={msg.content} className="message audio-message"></audio>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="input-container">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                    disabled={isRecording} // Optionally disable input during recording
                />
                <button onClick={sendMessage} className="send-button">
                    <img src={sendLogo} alt="Logo" className="button-logo" /> Send
                </button>
                {isRecording ? (
                    <button onClick={toggleRecording} className="record-button">
                        <img src={recordLogo} alt="Logo" className="button-logo" />Stop Recording</button>
                ) : (
                    <button onClick={toggleRecording} className="record-button">
                        <img src={recordLogo} alt="Logo" className="button-logo" />Record Voice</button>
                )}
            </div>
        </div>
    )
}    
export default ChatPage;
