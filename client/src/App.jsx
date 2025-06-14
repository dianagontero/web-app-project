import './App.css'
import { Routes, Route } from 'react-router'
import Header from './components/Header.jsx'
import  Home  from './components/Home.jsx'
import Login from './components/Login.jsx'
import Rules from './components/Rules.jsx'
import Game from './components/Game.jsx'
import Demo from './components/Demo.jsx'
import MatchResult from './components/MatchResult.jsx'
import UserProfile from './components/UserProfile.jsx'
import {UserProvider} from './components/UserContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
  const [gameID, setGameID] = useState(null); // Store the game ID after starting a new game
  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header gameID={gameID} setGameID={setGameID}/>}>
          <Route index element={<Home/>} />
          <Route path="Login" element={<Login/>} />
          <Route path="Rules" element={<Rules/>} />
          <Route path='Game' element={<Game gameID={gameID} setGameID={setGameID}/>}/>
          <Route path=':GameId/Result' element={<MatchResult/>}/>
          <Route path='UserProfile' element={<UserProfile/>}/>
        </Route>
      </Routes>
    </UserProvider>
    </>
  )
}

export default App
