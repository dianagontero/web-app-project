import API from "../API.mjs";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Alert } from "react-bootstrap";
import { UserContext } from './UserContext.jsx';
import GameIntro from "./GameIntro.jsx";
import CardsRow from "./CardsRow.jsx";
import NewCard from "./NewCard.jsx";

function Game(props){
    const { user } = useContext(UserContext); // Access the user context to check if the user is logged in

    const {gameID, setGameID} = props; 

    const [cards, setCards] = useState([]); // Array to hold the drawn cards
    const [loading, setLoading] = useState(false); 
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [newCard, setNewCard] = useState(null); // Store the new card taken from the server
    const [wrongGuesses, setWrongGuesses] = useState(0); // Counter for wrong guesses
    const [timer, setTimer] = useState(30); // Timer for the game, starting at 30 seconds
    const [activeTimer, setActiveTimer] = useState(false); // Flag to indicate if the timer is active

    const navigate = useNavigate();

    // victory case
    React.useEffect(() => { 
        if (cards.length >= 6 && user) { // logged in user
            API.UpdateGame(user.id, gameID, 1, 6);
            setGameID(null); // Reset gameID after victory
            navigate(`/${gameID}/Result`, { state: { cards } });
        }
        else if (cards.length >= 4 && !user) {
            API.UpdateGame(0, gameID, 1, 4); // demo user
            setGameID(null); // Reset gameID after victory
            navigate(`/${gameID}/Result`, { state: { cards } });   
        }
    }, [cards.length]);

    // lose case
    React.useEffect(() => {
        if (wrongGuesses >= 3 && user) { // logged in user
            API.UpdateGame(user.id, gameID, 0, cards.length); 
            setGameID(null); // Reset gameID after victory
            navigate(`/${gameID}/Result`, { state: { cards } });
        }
        else if (wrongGuesses >= 1 && !user) { // demo user
            API.UpdateGame(0, gameID, 0, 3); 
            setGameID(null); // Reset gameID after victory
            navigate(`/${gameID}/Result`, { state: { cards } });
        }
    }, [wrongGuesses]);

    // handle timer 
    React.useEffect(() => {
        let timerInterval;
        if (activeTimer && timer > 0) {
            timerInterval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        else if (activeTimer && timer === 0) { // Timer reached zero
           handleTimeOut();
        }
        return () => clearInterval(timerInterval); 
    }, [activeTimer, timer]);

    // start a new game 
    const handleStartGame = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const game = await API.startNewGame(user?user.id:0); //post a game in db
            setGameID(game); 
            const data = await API.getInitialCards(game, user?user.id:0); // get 3 cards from db + post them in RoundCard table if logged in user
            const sortedCards = data.sort((a, b) => a.level - b.level);
            setCards(sortedCards); 
            setWrongGuesses(0); 
            setNewCard(null); 
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    // get a new card from the server
    const getNewCard = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            let newc;
            if (!user) {
                newc = await API.getCardDemo(gameID, cards, Date.now()); //get a card from db + post it in TIMER_CARD table
                //cards used to take a new different card
            }
            else {
                newc = await API.getCard(gameID, Date.now()); //get a card from db + post it in TIMER_CARD table
            }
            setNewCard(newc);
            setTimer(30); // Reset timer to 30 seconds
            setActiveTimer(true);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    }

    // player placing a card
    const handleDrop = async (e, insertIndex, levelsx, leveldx) => {
        e.preventDefault(); 
        setActiveTimer(false); // Stop the timer when a card is dropped
        const droppedCard = JSON.parse(e.dataTransfer.getData('text/plain')); 
        try {
            const round = wrongGuesses + cards.length - 2; // Calculating the current round based on wrong guesses and cards drawn
            const check = await API.CheckAnswer(newCard.CardId, levelsx, leveldx, user?user.id:0, round, gameID, Date.now());
            //check if card is placed in right position and time < 30 seconds + post it in RoundCard table if logged in user
            if (check.success) {
                setSuccessMsg("Congratulations! You guessed right!");
                setErrorMsg(null);
                setCards((prevCards) => {
                    let newCards = [...prevCards];
                    newCards.splice(insertIndex, 0, check.card);
                    return newCards;
                });
            } else {
                setWrongGuesses((prev) => {
                    let newWrongGuesses = prev + 1;
                    if (check.timeout) { // If the user is trying to cheat by placing a card after the timer has expired
                        setErrorMsg("You are cheating! You have " + (3 - newWrongGuesses) + " guesses left.");
                    }
                    else { // If the user placed the card in the wrong position
                        setErrorMsg("Wrong guess! You have " + (3 - newWrongGuesses) + " guesses left.");
                    }
                    setSuccessMsg(null);
                    return newWrongGuesses;
                });
            }
            setNewCard(null);
        } catch (error) {
            alert("Error in checking card: " + error.message);
            setNewCard(null);
        }
    }

    // handle timeout when the timer reaches zero
    const handleTimeOut = () => {
        if (user) {
            const round = wrongGuesses + cards.length - 2; // Calculate the current round based on wrong guesses and cards drawn
            API.UpdateRound(newCard.CardId, gameID, round); // Update round card with lose
        }
        setActiveTimer(false); // Stop the timer
        setNewCard(null); // Reset the new card
        setWrongGuesses((prev) => {
            let newWrongGuesses = prev + 1;
            setErrorMsg("Time's up! You have " + (3 - newWrongGuesses) + " guesses left.");
            setSuccessMsg(null);
            return newWrongGuesses;
        });
        
    }

    return (
        <div className="container py-4">
            {!gameID ? (
                GameIntro({ loading: loading, handleStartGame: handleStartGame }) // Render GameIntro component if gameID is not set
                ) : (
                CardsRow({cards: cards, handleDrop: handleDrop }) // Render CardsRow component if gameID is set
            )}

        {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {gameID && (
           NewCard({ getNewCard: getNewCard, loading: loading, newCard: newCard, activeTimer: activeTimer, timer: timer}) // Render NewCard component if gameID is set
        )}
        </div>
    );
}

export default Game;