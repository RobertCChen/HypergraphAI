import React, { useState, useEffect } from 'react';
import './App.css';
import useKeyPress from './hooks/useKeyPress';
import { defer } from 'rxjs';

function App() {
  const [words, setWords] = useState(""); // autosuggested words
  const [written, setWritten] = useState("");
  const [typingWord, setTypingWord] = useState(false);
  const [timeInactive, setTimeInactive] = useState(0);
  const [autocompleted, setAutocompleted] = useState(0);

  useEffect(() => {
    //console.log(timeInactive);
    let interval = null;
    interval = setInterval(() => {
      setTimeInactive(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeInactive]);



  useEffect(() => {
    if (typingWord) {
      return;
    }
    let context = written.substring(Math.max(0, written.length-300));
    const subscription = defer(() => fetch('/words?context=' + context + ' ')).subscribe(res => res.json().then(data => {
      //console.log(data.words);
      setWords(data.words);
    }));
    return () => {
      subscription.unsubscribe();
    };
  }, [typingWord, autocompleted]);

  useKeyPress(key => {
    setTimeInactive(0);
    if (key === 'Enter') {
      if (words.length > 0) {
        setWritten(written + words + ' ');
        setAutocompleted(autocompleted + 1);
        setWords('');
      }
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
    if (typingWord) {
      let writtenArr = written.split(' ');
      setWritten(writtenArr.slice(0, writtenArr.length - 1).join(' ') + ' ' + words.split(' ')[0] + ' ');
    } else {
      setWritten(written + words.split(' ')[0] + ' ');
    }
    setAutocompleted(autocompleted + 1);
    setTypingWord(false);
    setWords('');
  }

  return (
    <div className="App">
      <header className="App-header">
      <div id="mySidenav" className="sidenav">
      <a href="#" id="about">
      <span style={{color:'red'}}>Hypergraphia:</span> <span style={{color:'grey'}}>intense desire to write.</span>
      <br/><br/>

      Have writer's block? Can't force yourself to write? HypergraphAI uses the GPT-2 language model to
      write for you!
      <br/><br/>
      After 3 seconds without typing, GPT-2 will insert the next word for you. You can also
      press enter to accept GPT-2's suggestions.
      <br/><br/>
      Don't worry too much about typoez or if the writing doesn't make
      sense—just write!
      </a>
    </div>

        <h2><span style={{color:'turquoise'}}> HypergraphAI:</span> Break your writer's block and attain <span style={{color:'brown'}}>hypergraphia</span></h2>
        <span style={{fontSize:16}}> No edits. No redos. Just write. </span>
        <p className="Text">
          {written}
          <span className="Text-current">{(!typingWord) ? words.charAt(0) : <span>&nbsp;</span>}</span>
          <span className="Text-generated">{(!typingWord) ? words.substring(1) : <span>&nbsp;</span>}</span>
        </p>
        <span className="Counter">You have written <span style={{color:'turquoise'}}>{written.split(' ').length - 1}</span> words. GPT-2 has helped <span style={{color:'turquoise'}}> {autocompleted}</span> times.</span>
      </header>
    </div>
  );
}

export default App;
