import React, { useState, useEffect } from 'react';
import './App.css';
import { generate } from './utils/words';
import useKeyPress from './hooks/useKeyPress';



function App() {
  const [words, setWords] = useState(""); // autosuggested words
  const [written, setWritten] = useState("");
  const [typingWord, setTypingWord] = useState(false);
  const [timeInactive, setTimeInactive] = useState(0);
  const [autocompleted, setAutocompleted] = useState(0);

  useEffect(() => {
    console.log(timeInactive);
    let interval = null;
    interval = setInterval(() => {
      setTimeInactive(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeInactive]);



  useEffect(() => {
    if (!typingWord) {
      fetch('/words?context=' + written + ' ').then(res => res.json()).then(data => {
        setWords(data.words);
        setTypingWord(false);
      });
    }
  }, [typingWord, autocompleted]);

  useKeyPress(key => {
    setTimeInactive(0);
    if (key === 'Enter') {
      setWritten(written + words + ' ');
      setAutocompleted(autocompleted + 1);
      setWords('');
    } else {
      setWritten(written + key);
      if (key === ' ') {
        setTypingWord(false);
        setWords('');
      } else {
        setTypingWord(true);
      }
    }
  });

  if (timeInactive > 3) {
    setTimeInactive(0);
    setWritten(written + words.split(' ')[0] + ' ');
    setAutocompleted(autocompleted + 1);
    setTypingWord(false);
    setWords('');
  }

  return (
    <div className="App">
      <header className="App-header">
        HypergraphAI: Break your writer's block and attain hypergraphia
        <p className="Text">
          {written}
          <span className="Text-current">{(!typingWord) ? words.charAt(0) : <span>&nbsp;</span>}</span>
          <span className="Text-generated">{(!typingWord) ? words.substring(1) : <span>&nbsp;</span>}</span>
        </p>
      </header>
    </div>
  );
}

export default App;
