import './App.css'
import { Routes, Route } from 'react-router'
import Header from './components/Header.jsx'
import  Home  from './components/Home.jsx'
import Login from './components/Login.jsx'
import Rules from './components/Rules.jsx'
import Game from './components/Game.jsx'
import MatchResult from './components/MatchResult.jsx'
import UserProfile from './components/UserProfile.jsx'
import {UserProvider} from './components/UserContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import GameIntro from './components/GameIntro.jsx'

function App() {

  const [gameID, setGameID] = useState(null); // Store the game ID after starting a new game
  const [cards, setCards] = useState([]); // Array to hold the drawn cards
  const [wrongGuesses, setWrongGuesses] = useState(0); // Counter for wrong guesses
  const [newCard, setNewCard] = useState(null); // Store the new card taken from the server
  
  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header gameID={gameID} setGameID={setGameID}/>}>
          <Route index element={<Home/>} />
          <Route path="Login" element={<Login/>} />
          <Route path="Rules" element={<Rules/>} />
          <Route path='GameIntro' element={<GameIntro gameID={gameID} setGameID={setGameID} cards={cards} setCards={setCards} setWrongGuesses={setWrongGuesses} setNewCard={setNewCard}/>}/>
          <Route path=':GameId' element = {<Game gameID={gameID} setGameID={setGameID} cards={cards} setCards={setCards} wrongGuesses={wrongGuesses} setWrongGuesses={setWrongGuesses} newCard={newCard} setNewCard={setNewCard}/>}/>
          <Route path=':GameId/Result' element={<MatchResult/>}/>
          <Route path='UserProfile' element={<UserProfile/>}/>
        </Route>
      </Routes>
    </UserProvider>
    </>
  )
}

export default App
