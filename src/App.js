import logo from './logo.svg';
import React, { useState } from 'react';
import styled from 'styled-components';
import {SpeechConfig, AudioConfig, SpeechSynthesizer} from 'microsoft-cognitiveservices-speech-sdk';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './App.css';
import { chat } from './generate.js'

const StyledInput = styled.input`
  width: inherit;
  height: 30px;
  margin: 20px 20px;
  border: 1px solid lightblue;
`;

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleRecordClick = async () => {
    if (!isRecording) {
      setIsRecording(true);
      SpeechRecognition.startListening({ continuous: true });
    } else {
      setIsRecording(false);
      SpeechRecognition.stopListening();
      
      var result = await chat(transcript);
      setMessages([...messages, `Me: ${transcript}`, `Johnny: ${result}`]);
      synthesizeSpeech(result);
      resetTranscript();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    var result = await chat(inputValue);
    setMessages([...messages, `Me: ${inputValue}`, `Johnny: ${result}`]);
    synthesizeSpeech(result);
    setInputValue("");
    
  };
  
  const handleChange = (event) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  function synthesizeSpeech(text) {
    const speechConfig = SpeechConfig.fromSubscription("", "eastus");
    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();

    const speechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    speechSynthesizer.speakTextAsync(
        text,
        result => {
            if (result) {
                speechSynthesizer.close();
                return result.audioData;
            }
        },
        error => {
            console.log(error);
            speechSynthesizer.close();
        });
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Testing Chat With Me Bot
          </p>
        </header>
        <div className='App-Body'>
          <div className='Message-History'>
            {messages.map((message, index) => (
              <p key={index} className='Message'>{message}</p>
            ))}
          </div>
          <div className='Input-Box'>
            <StyledInput
              type="text" value={inputValue} onChange={handleChange}
              placeholder="Type in here"
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleRecordClick}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        </div>

      </div>
    );
}

export default App;
