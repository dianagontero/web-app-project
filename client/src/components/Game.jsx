import API from "../API.mjs";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { Alert } from "react-bootstrap";
import { UserContext } from './UserContext.jsx';
import CardsRow from "./CardsRow.jsx";
import NewCard from "./NewCard.jsx";

function Game(props){
    const { user } = useContext(UserContext); // Access the user context to check if the user is logged in

    const {gameID, setGameID, cards, setCards, wrongGuesses, setWrongGuesses, newCard, setNewCard } = props; 

    const [loading, setLoading] = useState(false); 
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [timer, setTimer] = useState(30); // Timer for the game, starting at 30 seconds
    const [activeTimer, setActiveTimer] = useState(false); // Flag to indicate if the timer is active
    const [gameEnd, setGameEnd] = useState(false); // Flag to indicate if the game has ended

    const navigate = useNavigate();

   // victory case
    React.useEffect(() => { 
        if (cards.length >= 6 && user) { // logged in user
            setTimeout( () => {
                setGameID(null); // Reset gameID to null for a new game
                navigate(`/${gameID}/Result`, { state: { cards } });
            }, 1000); // Delay to show the last victory message
        }
        else if (cards.length >= 4 && !user) {
            setTimeout( () => {
                setGameID(null); // Reset gameID to null for a new game
                navigate(`/${gameID}/Result`, { state: { cards } });
            }, 1000); // Delay to show the last victory  essage
        }
    }, [cards.length]);

    // lose case
    React.useEffect(() => {
        if (wrongGuesses >= 3 && user) { // logged in user
            setTimeout( () => {
                setGameID(null); // Reset gameID to null for a new game
                navigate(`/${gameID}/Result`, { state: { cards } });
            }, 1000); // Delay to show the last wrong guess message
        }
        else if (wrongGuesses >= 1 && !user) { // demo user
            setTimeout( () => {
                setGameID(null); // Reset gameID to null for a new game
                navigate(`/${gameID}/Result`, { state: { cards } });
            }, 1000); // Delay to show the last wrong guess message
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


    // get a new card from the server
    const getNewCard = async () => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
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

    //updating the game result (victory)
    const updateGameVictory = async () => {
        try {
            if (user) {
                await API.UpdateGame(user.id, gameID, 1, 6); // Update game result for logged in user
            } else {
                await API.UpdateGame(0, gameID, 1, 4); // Update game result for demo user
            }
        } catch (error) {
            console.error("Error updating game result:", error);
        }
    }

    //updating the game result (loss)
    const updateGameLoss = async () => {
        try {
            if (user) {
                await API.UpdateGame(user.id, gameID, 0, cards.length); // Update game result for logged in user
            }
            else {
                await API.UpdateGame(0, gameID, 0, 3); // Update game result for demo user
            }
        } catch (error) {
            console.error("Error updating game result:", error);
        }
    }

    // player placing a card
    const handleDrop = async (e, insertIndex, levelsx, leveldx) => {
        e.preventDefault(); 
        setActiveTimer(false); // Stop the timer when a card is dropped
        try {
            const round = wrongGuesses + cards.length - 2; // Calculating the current round based on wrong guesses and cards drawn
            const check = await API.CheckAnswer(newCard.CardId, levelsx, leveldx, user?user.id:0, round, gameID, Date.now());
            //check if card is placed in right position and time < 30 seconds + post it in RoundCard table if logged in user
            if (check.success) {
                let newCards = [...cards]; //newcards used for API
                newCards.splice(insertIndex, 0, check.card);
                setCards((prevCards) => {
                    let newCards = [...prevCards];
                    newCards.splice(insertIndex, 0, check.card);
                    return newCards;
                });
                if ((user && newCards.length >= 6) || (!user && newCards.length >= 4)) { //victory
                    setGameEnd(true); // Set game end flag to true
                    updateGameVictory(); 
                }
                setSuccessMsg("Congratulations! You guessed right!");
                setErrorMsg(null);

            } else {
                let newWrongGuesses = wrongGuesses + 1; //newWrongGuesses used for API
                setWrongGuesses((prev) => {
                    let newWrongGuesses = prev + 1;
                    return newWrongGuesses;
                });
                if ((newWrongGuesses >= 3 && user) || (newWrongGuesses >= 1 && !user)) { //lose 
                    setGameEnd(true); // Set game end flag to true
                    updateGameLoss();
                }
                if (check.timeout) { // If the user is trying to cheat by placing a card after the timer has expired
                    if (user) {
                        setErrorMsg("You are cheating! You have " + (3 - newWrongGuesses) + " guesses left.");
                    }
                    else {
                        setErrorMsg("You are cheating! You have 0 guesses left.");
                    }
                }
                else { // If the user placed the card in the wrong position
                    if (user) {
                        setErrorMsg("Wrong guess! You have " + (3 - newWrongGuesses) + " guesses left.");
                    }
                    else {
                        setErrorMsg("Wrong guess! You have 0 guesses left.");
                    }
                }
                setSuccessMsg(null);    
            }
            setNewCard(null);
        } catch (error) {
            alert("Error in checking card: " + error.message);
            setNewCard(null);
        } 
    }

    // handle timeout when the timer reaches zero
    const handleTimeOut = async() => {
        if (user) {
            const round = wrongGuesses + cards.length - 2; // Calculate the current round based on wrong guesses and cards drawn
            await API.UpdateRound(newCard.CardId, gameID, round); // Update round card with lose
        }
        setActiveTimer(false); // Stop the timer
        setNewCard(null); // Reset the new card
        let newWrongGuesses = wrongGuesses + 1;
        setWrongGuesses((prev) => {
            let newWrongGuesses = prev + 1;
            return newWrongGuesses;
        });
        if ((newWrongGuesses >= 3 && user) || (newWrongGuesses >= 1 && !user)) { //lose 
            setGameEnd(true); // Set game end flag to true
            updateGameLoss();
        }
        if (user) {
            setErrorMsg("Time's up! You guessed wrong! You have " + (3 - newWrongGuesses) + " guesses left.");
        }
        else {
            setErrorMsg("Time's up! You guessed wrong! You have 0 guesses left.");
        }
        setSuccessMsg(null);
        
    }

    return (
        <div > 
            <CardsRow cards={cards} handleDrop={handleDrop} />
            {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)} dismissible>{successMsg}</Alert>}
            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
            <NewCard getNewCard={getNewCard} loading={loading} newCard={newCard} activeTimer={activeTimer} timer={timer} gameEnd={gameEnd}/>
        </div>
    );
}

export default Game;