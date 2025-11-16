import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AboutPage from './AboutPage';
import ContactForm from './ContactForm';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Register from './Register';
import EmojiLogin from './EmojiLogin';
import Calendar from './Calendar';
import AdminP from "./AdminPage";
import ParentPage from "./ParentPage";
import EmployeePage from './EmployeePage';
import ClientPage from './ClientPage';
import GamesPage from './GamesPage';
import ChatPage from './ChatPage';
import Connect4 from './connect4';
import Form from "./formbuilder";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './ContactUs.css';
import './Footer.css';

function App() {
  useEffect(() => {
    document.title = "CHEER";
  }, []);

  const [isTextToSpeechEnabled, setIsTextToSpeechEnabled] = useState(true);

  const handleDonateClick = () => {
    window.location.href = 'https://www.canadahelps.org/en/pages/olli-cheer/';
  };

  const speakText = (text) => {
    if (isTextToSpeechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleTextToSpeech = () => {
    setIsTextToSpeechEnabled(!isTextToSpeechEnabled);
  };

  return (
    <Router>
      <div className="App">
        <header className="home-header">
        
          <img src="./1.png" alt="Company Logo" className="company-logo" />
          <h1 className="header-title">Ongoing Living & Learning Inc.</h1>
          <button onClick={toggleTextToSpeech} className="text-to-speech-toggle">
              <img src={isTextToSpeechEnabled ? "./mic.png" : "./micoff.png"} alt="TTS Icon" style={{ marginRight: '8px' }}/>
              {isTextToSpeechEnabled ? "Disable TTS" : "Enable TTS"}
            </button>
          <Link to="/"><button onMouseEnter={() => speakText("Home")} className="home-button-header"><img src= "./h.png" alt="Home" className="sign-icon" /> Home </button></Link>
          <Link to="/login-page"><button onMouseEnter={() => speakText("User Login")} className="login-button-header"><img src= "./loginpic.png" alt="Login" className="login-icon2" /> User Login</button></Link>
          <Link to="/register"><button onMouseEnter={() => speakText("Sign Up")} className="signup-button-header"><img src= "./sign.png" alt="Sign Up" className="sign-icon" />Sign Up</button></Link>
          <button onMouseEnter={() => speakText("Donate")} className="donate-button-header" onClick={handleDonateClick}>
            <img src= "./donate.png" alt="Donate" className="donate-icon" />
            Donate
          </button>
        </header>
        <div className="main-content"> 
          <Routes>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/form" element={<Form />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/login-page" element={<LoginPage />} />
            <Route path="/emoji-login-page" element={<EmojiLogin />} />
            <Route path="/register" element={<Register/>}/> 
            <Route path="/Calendar" element={<Calendar/>}/> 
            <Route path="/Admin" element={<AdminP/>}/>
            <Route path="/ClientPage" element={<ClientPage  isTextToSpeechEnabled={isTextToSpeechEnabled}  />}/>  
            <Route path="/ParentPage" element={<ParentPage />} /> 
            <Route path="/EmployeePage" element={<EmployeePage />}/>
            <Route path="/games" element={<GamesPage isTextToSpeechEnabled={isTextToSpeechEnabled}  />}/>
            <Route path="/chat" element={<ChatPage />}/>
            <Route path="/connect4" element={<Connect4 />}/>
            <Route path="/" element={<HomePage    isTextToSpeechEnabled={isTextToSpeechEnabled}  />} />
          </Routes>
        </div>
        <footer className="footer">
          <div className="footer-section">
            <h2>Ongoing Living & Learning Inc</h2>
          </div>
          <div className="footer-section facebook-section">
            <h3>Find us on Facebook</h3>
            <a href="https://www.facebook.com/cheer.2023">CHEER Facebook Page</a>
            <a href="https://www.facebook.com/familyconnectionscheer">CHEER Connections Facebook Page</a>
            <a href="https://www.facebook.com/people/Roxys-Mini-Golf-and-Cheer-Canteen/100057044577232/">CHEER Works Facebook Page</a>
          </div>
          <div className="footer-section contact-section">
            <h3>Contact Us</h3> 
            <Link to="/contact" className="footer-button">
              <img src="./contact.png" alt="Contact" className="contact-icon"/>Contact
            </Link>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
