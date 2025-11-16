
import React from 'react';
import './GamesPage.css';
import { useNavigate } from 'react-router-dom';

const GamesPage = ({isTextToSpeechEnabled}) => {
    const navigate = useNavigate();

    const handleGameSelection = (game) => {
        switch (game) {
            case 'Uno':
                window.open('https://play.famobi.com/duo-cards', '_blank');
                break;
            case 'Coloring':
                window.open('https://play.famobi.com/kids-color-book', '_blank');
                break;
            case 'Matching':
                window.open('https://play.famobi.com/kitten-match', '_blank');
                break;
            case 'Connect 4':
                navigate('/connect4');
                break;
            default:
                console.log("Game not found");
        }
    };
    const speakText = (text) => {
        if (isTextToSpeechEnabled) {
          const utterance = new SpeechSynthesisUtterance(text);
          speechSynthesis.speak(utterance);
        }
      };
    const gameImages = [
        { game: 'Uno', image: require('./uno.png') },
        { game: 'Connect 4', image: require('./connect4.png') },
        { game: 'Coloring', image: require('./coloring.jpg') },
        { game: 'Matching', image: require('./m.png') },
    ];

    return (
        <div className="games-container">
            <br></br> <br></br>
            <h1>Games Page</h1>
            <br></br> <br></br>
            <div className="games-grid">
                {gameImages.map((gameImage) => (
                    <div key={gameImage.game} className="game-item" onClick={() => handleGameSelection(gameImage.game)}>
                        <img
                            className="game-image"
                            src={gameImage.image}
                            alt={gameImage.game}
                            onMouseEnter={() => speakText(gameImage.game)}
                        />
                        <p>Play {gameImage.game}</p>
                    </div>
                ))}
            </div>
            <br></br><br></br>

        </div>
        
    );
};

export default GamesPage;
