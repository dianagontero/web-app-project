import './App.css'
import { Routes, Route } from 'react-router'
import Header from './components/Header.jsx'
import  Home  from './components/Home.jsx'
import Login from './components/Login.jsx'
import Rules from './components/Rules.jsx'
import Game from './components/Game.jsx'
import Demo from './components/Demo.jsx'
import MatchResult from './components/MatchResult.jsx'
import {UserProvider} from './components/UserContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header/>}>
          <Route index element={<Home/>} />
          <Route path="Login" element={<Login/>} />
          <Route path="Rules" element={<Rules/>} />
          <Route path='Game' element={<Game/>}/>
          <Route path='Result' element={<MatchResult/>}/>        
          <Route path='Demo' element={<Demo/>}/>
        </Route>
      </Routes>
    </UserProvider>
    </>
  )
}

export default App
