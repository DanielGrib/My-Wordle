import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Guessingwords from './words.json';

const generateRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * Guessingwords.length);
  return Guessingwords[randomIndex];
};

function App() {
  const [targetWord, setTargetWord] = useState(generateRandomWord());
  const [userInput, setUserInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

  const handleGuess = useCallback(() => {
    if (
      userInput &&
      userInput.length === targetWord.length &&
      !correctGuess &&
      guessCount < 6
    ) {
      const newGuesses = [...guesses, userInput];
      setGuesses(newGuesses);
      setUserInput('');

      if (userInput === targetWord) {
        setCorrectGuess(true);

        if (guessCount + 1 === 6) {
          setTimeout(() => {
            alert('You won!');
            resetGame();
          }, 0);
        } else {
          setTimeout(() => {
            resetGame();
          }, 0);
        }
      } else {
        setGuessCount(guessCount + 1);
      }
    }
  }, [userInput, targetWord, correctGuess, guessCount, guesses]);

  useEffect(() => {
    const maxBoxes=targetWord.length;
    const handleKeyDown = (e) => {
      if (!correctGuess && document.activeElement.tagName !== 'INPUT') {
        if (e.key === 'Backspace') {
          e.preventDefault();
          setUserInput((prevInput) => prevInput.slice(0, -1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleGuess();
        } else if (/^[a-z]$/.test(e.key) && userInput.length < maxBoxes) {
          setUserInput((prevInput) => prevInput + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [correctGuess, handleGuess]);

  useEffect(() => {
    if (guessCount === 6 && !correctGuess) {
      setTimeout(() => {
        alert(`You ran out of guesses. The correct word was ${targetWord}.`);
        resetGame();
      }, 0);
    }
  }, [guessCount, targetWord, correctGuess]);

  const resetGame = () => {
    setTargetWord(generateRandomWord());
    setGuesses([]);
    setCorrectGuess(false);
    setGuessCount(0);
  };

  const getLetterClass = (userLetter, index, guessIndex) => {
    const userGuess = guesses[guessIndex] || '';
    if (userGuess[index] === targetWord[index]) {
      return 'correct';
    } else if (targetWord.includes(userGuess[index])) {
      return 'correct-wrong-position';
    } else {
      return '';
    }
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={handleGuess}>
      <h1>Wordle</h1>
      {guesses.map((guess, index) => (
        <div key={index}>
          <p>Guess {index + 1}:</p>
          <div>
            {targetWord.split('').map((letter, i) => (
              <span
                key={i}
                className={getLetterClass(letter, i, index)}
              >
                {guess[i] || '_'}
              </span>
            ))}
          </div>
        </div>
      ))}
      {!correctGuess && guessCount < 6 && (
        <>
          <p>Your Guess:</p>
          <div>
          
            {targetWord.split('').map((letter, index) => (
              <span
                key={index}
                className={getLetterClass(letter, index, guessCount)}
              >
                {userInput[index] || '_'}
              </span>
            ))}
          </div>
          <br />
          <button onClick={handleGuess} disabled={userInput.length !== targetWord.length}>
            Guess
          </button>
        </>
      )}
    </div>
  );
}

export default App;