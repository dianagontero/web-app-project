import API from "../API.mjs";
import React, { useState } from "react";


function Game(){
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [gameID, setGameID] = useState(null);
    const [newCard, setNewCard] = useState(null);

    const handleStartGame = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const gameobject = await API.startNewGame(1); // TO DO gestisci VERO UTENTE

            setGameID(gameobject); //taking the id from the object
            // Fetch initial cards for the game
            const data = await API.getInitialCards(gameobject);
            const sortedCards = data.sort((a, b) => a.level - b.level);
            setCards(sortedCards); 
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getNewCard = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const newCard = await API.getCard(gameID);
            setNewCard(newCard);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDrop = async (e, insertIndex = null, levelsx, leveldx) => {
        e.preventDefault();
        const droppedCard = JSON.parse(e.dataTransfer.getData('text/plain'));
        try {
            const isWon = await API.checkCard(droppedCard.CardId, levelsx, leveldx);
            if (isWon) {
                setCards((prevCards) => {
                    if (insertIndex === null) {
                        return [...prevCards, droppedCard];
                    } else {
                        const newCards = [...prevCards];
                        newCards.splice(insertIndex, 0, droppedCard);
                        return newCards;
                    }
                });
                setNewCard(null);
            } else {
                alert("You guessed wrong! This card is not in the right position.");
            }
        } catch (error) {
            alert("Error in checking card: " + error.message);
        }
    }
    return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center p-4">
        
        {!gameID ? ( 
        <>
            <h1 className="mb-4 text-primary">Let the misfortune begin!</h1>
            <button className="btn btn-danger mb-4"onClick={handleStartGame} disabled={loading}> 
                {loading ? 'Loading cards...' : 'Click to draw your starting cards'}
            </button>
        </>
        ) : (
            <div className="d-flex flex-wrap justify-content-center gap-3">

                {/* Drop zone to insert at the beginning */}
                <div
                style={{ width: '18rem', height: '100px', border: '2px dashed gray', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 0, -1, cards[1].level)}> 
                    <p className="text-muted">Drop here to add at the beginning</p>
                </div>


                {/* Cards already drawn */}
                {cards.map((card, index) => (
                <div key={card.CardId} className="card" style={{ width: '18rem' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, index, cards[index - 1].level, cards[index + 1].level)}>
                    <div className="card-body">
                        <h5 className="card-title">{card.title}</h5>
                        <p className="card-text"><strong>Level:</strong> {card.level}</p>
                    </div>
                </div>
                ))}

                {/* Drop zone to insert at the end */}
                <div style={{ width: '18rem', height: '100px', border: '2px dashed gray', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, null, cards[cards.length - 1].level, 101)}>
                    <p className="text-muted">Drop here to add at the end</p>
                </div>
            </div>
            )}

            {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

            {gameID && (
                <>
                <button
                    className="btn btn-outline-danger mt-5"
                    onClick={getNewCard}
                    disabled={loading}>
                    {loading ? 'Loading...' : 'Draw new situation'}
                </button>
                    {newCard && (
                    <div className="mt-4">
                        <h5 className="mb-3 text-info">New situation:</h5>
                            <div className="card mx-auto" style={{ width: '18rem' }}
                                draggable
                                onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', JSON.stringify(newCard));
                            }}>
                                <div className="card-body">
                                    <h5 className="card-title">{newCard.title}</h5>
                                </div>
                            </div>
                    </div>
            )}
            </>
        )}
        </div>
    );
}

export default Game;