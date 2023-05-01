import React, { useState, useEffect } from 'react';
import { shuffle } from 'lodash';
import cardback from './cardback.png';
import emptycard from './emptycard.png';
import card1 from './card1.png';
import card2 from './card2.png';
import card3 from './card3.png';
import card4 from './card4.png';
import card5 from './card5.png';
import card6 from './card6.png';
import card7 from './card7.png';
import card8 from './card8.png';
import './App.css';

function App() {
//state for the cards and their individual parameters
  const [cards, setCards] = useState([
    { id: 1, src: card1, flipped: false },
    { id: 2, src: card2, flipped: false },
    { id: 3, src: card3, flipped: false },
    { id: 4, src: card4, flipped: false },
    { id: 5, src: card5, flipped: false },
    { id: 6, src: card6, flipped: false },
    { id: 7, src: card7, flipped: false },
    { id: 8, src: card8, flipped: false },
    { id: 9, src: card1, flipped: false },
    { id: 10, src: card2, flipped: false },
    { id: 11, src: card3, flipped: false },
    { id: 12, src: card4, flipped: false },
    { id: 13, src: card5, flipped: false },
    { id: 14, src: card6, flipped: false },
    { id: 15, src: card7, flipped: false },
    { id: 16, src: card8, flipped: false }
  ]);

//state of featured text at the top of the page
const [Title, setTitle] = useState("Memory Game!");
//state for the button visibility
const [isReady, setIsReady] = useState(true);
//state for the countdown at the begenning
const [countdown, setCountdown] = useState(null);
//state for who's turn it is
const [currentPlayer, setCurrentPlayer] = useState(1);
//state to WHICH cards were flipped
const [whichCards, setWhichCards] = useState([]);
//players' scoreboard
const [playerScores, setPlayerScores] = useState([0, 0]);
//Game active?
const [gameActive, setGameActive] = useState(false);

//everyday I'm sufflin'
useEffect(() => {
  setCards(cards => shuffle(cards));
}, []);

// title update
useEffect(() => {
  if (gameActive) {
    setTitle((<><p>It's Player {currentPlayer}s turn</p><div className='Row'>Player 1: {playerScores[0]} &nbsp;&nbsp;&nbsp; Player 2: {playerScores[1]}<br /></div></>));
  } else {
    setTitle("Memory Game!");
  }
}, [gameActive, currentPlayer, playerScores]);
// updates cards to compare 'em and respond if there was a match
useEffect(() => {
  if (whichCards.length === 2) {
    const [card1, card2] = whichCards.map(id => cards.find(card => card.id === id));
    console.log("card1:", card1, "card2:", card2);
    if (card1.src === card2.src && card1.id !== card2.id){
      alert ('cards match!');
      setPlayerScores(prevScores => {
        const newScores = [...prevScores];
        newScores[currentPlayer - 1]++;
        return newScores;
      });
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        card1.src = emptycard;
        card2.src = emptycard;
    } else {
      alert ('cards do not match!');
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setCards(prevCards =>
        prevCards.map(card => {
          if (whichCards.includes(card.id)) {
            return { ...card, flipped: false };
          }
          return card;
        })
      );
    }
    setWhichCards([]);
  }
}, [whichCards, cards, currentPlayer]);

useEffect(() => {
  const isAllEmpty = cards.every(card => card.src === emptycard);
  if (isAllEmpty) {
    if (playerScores[0] > playerScores[1]) {
      setTitle(`Game over! Player 1 wins!`);
    } else if (playerScores[1] > playerScores[0]) {
      setTitle(`Game over! Player 2 wins!`);
    } else {
      setTitle(`It's a draw! Everyone wins!`);
    }
    setGameActive(false);
  }
}, [cards, playerScores]);

// function that flips the cards
async function flipCard(id) {
  if (!gameActive) {
    return;
  }
  
  const cardToFlip = cards.find(card => card.id === id);
  if (cardToFlip.src === emptycard) {
    return;
  }

  setCards(prevCards =>
    prevCards.map(card => {
      if (card.id === id) {
        return { ...card, flipped: true };
      }
      return card;
    })
  );

    // Check if the card is already flipped
    if (whichCards.includes(id)) {
      return;
    }
  setWhichCards(prevFlippedCards => [...prevFlippedCards, id]);
}

function startGame() {
  // Reset player scores
  setPlayerScores([0, 0]);
  // Flip all cards for 10 seconds
  setCards(prevCards =>
    prevCards.map(card => ({ ...card, flipped: true }))
  );
  // Start countdown
  let timeLeft = 10;
  const countdownInterval = setInterval(() => {
    timeLeft--;
    setCountdown(timeLeft);
  }, 1000);
  // Initialize countdown
  setCountdown(timeLeft);
  // Hide the "Ready?" button
  setIsReady(false);

  setTimeout(() => {
    // Flip cards back to hide them
    setCards(prevCards =>
      prevCards.map(card => ({ ...card, flipped: false }))
    );
    // Stop countdown
    clearInterval(countdownInterval);
    setCountdown(null);
    // Start game with player 1
    setCurrentPlayer(1);
    // Set game to "active mode"
  setGameActive(true);
  }, 10000);
//10 second timer
}
const row1 = cards.slice(0, 8);
const row2 = cards.slice(8);
  
  return (
    <div className="App">
<header className="App-header">

{Title}
<br/><br/>
    </header>
      <div className="Row">
        {row1.map(card => (
          <img
            key={card.id}
            src={card.flipped ? card.src : cardback}
            className="Card"
            alt="card"
            onClick={() => flipCard(card.id)}
          />
        ))}
      </div>
      <div className="Row">
        {row2.map(card => (
          <img
            key={card.id}
            src={card.flipped ? card.src : cardback}
            className="Card"
            alt="card"
            onClick={() => flipCard(card.id)}
          />
        ))}
      </div>
      <br />
  {countdown !== null && (
  <div className="Countdown">{countdown}</div>
  )}
      {isReady && (
  <button className="StartButton" onClick={startGame}>
    Ready?
  </button>
)}
    </div>
  );
}
export default App;
