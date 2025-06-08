const SERVER_URL = 'http://localhost:3001';

// Start a new game logged in ( POST /api/users/:userId/matches )
const startNewGame = async (userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/users/${userId}/matches`, {
            method: 'POST',
        });
        const data = await response.json();

        if (response.status === 404) {
            throw new Error(`User not found: ${data.error}`);
        } else if (response.status === 500) {
            throw new Error(`Server error: ${data.error}`);
        } else if (!response.ok) {
            throw new Error(`Generic Error: ${data.error}`);
        }

        return data;
    }
    catch (error) {
        console.error('Error starting new game:', error);
        throw error;
    }
}

// Get initial cards for the game ( GET /api/cards/starting )
const getInitialCards = async (MatchId, UserId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/cards/starting`, );
        const cardsInitial = await response.json();

        if (response.status === 400) {
            throw new Error(`Initial cards not valid: ${cardsInitial.error}`);
        }
        else if (response.status === 500) {
            throw new Error(`Server error: ${cardsInitial.error}`);
        }
        else if (!response.ok) {
            throw new Error(`Generic Error: ${cardsInitial.error}`);
        }

        // Check if the response contains an array of cards
        if (!Array.isArray(cardsInitial) || cardsInitial.length < 3) {
            throw new Error('Invalid response: Expected an array of at least 3 cards');
        }

        const cards = [
            {CardId: cardsInitial[0].CardId, RoundResult: -1, roundNumber: 0},
            {CardId: cardsInitial[1].CardId, RoundResult: -1, roundNumber: 0},
            {CardId: cardsInitial[2].CardId, RoundResult: -1, roundNumber: 0},
        ]

        // If UserId is not 0 (i.e., a loggedin user), post the initial cards to the round card table
        if (UserId != 0) {
            const response2 = await fetch(`${SERVER_URL}/api/matches/${MatchId}/rounds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cards }), 
                credentials: 'include'
            });
            const data2 = await response2.json();

            if (response2.status === 400) {
                throw new Error(`Error creating round: ${data2.error}`);
            }
            else if (response2.status === 404) {
                throw new Error(`Not found: ${data2.error}`);
            }
            else if (response2.status === 500) {
                throw new Error(`Server error: ${data2.error}`);
            }
            else if (!response2.ok) {
                throw new Error(`Generic Error: ${data2.error}`);
            }
        }

        return cardsInitial; // Return the initial cards
    } 
    catch (error) {
        console.error('Error getting initial cards:', error);
        throw error;
    }
}

// Get a new card for the game ( POST /api/matches/:matchId/cards )
const getCard = async (MatchId, startTime) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/matches/${MatchId}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ startTime }), // Send the start time to post the card in TIMER_CARD table
            credentials: 'include'
        });
        const data = await response.json();

        if (response.status === 400) {
            throw new Error(`Card not valid: ${data.error}`);
        }
        else if (response.status === 404) {
            throw new Error(`Card not found: ${data.error}`);
        }
        else if (response.status === 500) {
            throw new Error(`Server error: ${data.error}`);
        }
        else if (!response.ok) {
            throw new Error(`Generic Error: ${data.error}`);
        }

        return data;
    } 
    catch (error) {
        console.error('Error getting new card:', error);
        throw error;
    }
}

// Get a new card for the demo ( POST /api/demo/cards )
const getCardDemo = async (matchId, cards, startTime) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/demo/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matchId, cards, startTime }), // cards used to take a new different card, and start time to post the card in TIMER_CARD table
        } );
        const data = await response.json();

        if (response.status === 400) {
            throw new Error(`Card not valid: ${data.error}`);
        }
        else if (response.status === 404) {
            throw new Error(`Card not found: ${data.error}`);
        }
        else if (response.status === 500) {
            throw new Error(`Server error: ${data.error}`);
        }
        else if (!response.ok) {
            throw new Error(`Generic Error: ${data.error}`);
        }

        return data;
    } 
    catch (error) {
        console.error('Error getting new card:', error);
        throw error;
    }   
}

// Check if card is right ( POST /api/cards/:cardId )
const CheckAnswer = async (CardId, levelsx, leveldx, UserId, round, MatchId, endTime) =>{
    try {
    const response = await fetch(`${SERVER_URL}/api/cards/${CardId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ levelsx, leveldx, endTime, MatchId }),
    });

    const data = await response.json();

    if (response.status === 404) {
        throw new Error(`Card not found: ${data.error}`);
    }
    else if (response.status === 500) {
        throw new Error(`Server error: ${data.error}`);
    }
    if (!response.ok) {
      throw new Error(`Generic Error: ${data.error}`);
    }

    if (UserId != 0) {
        const cards = [
            {CardId: CardId, RoundResult: data.success?1:0, roundNumber:round}
        ]

        const response2 = await fetch(`${SERVER_URL}/api/matches/${MatchId}/rounds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cards}), 
            credentials: 'include'
        });
        const data2 = await response2.json();

        if (response2.status === 400) {
            throw new Error(`Error creating round: ${data2.error}`);
        }
        else if (response2.status === 404) {
            throw new Error(`Not found: ${data2.error}`);
        }
        else if (response2.status === 500) {
            throw new Error(`Server error: ${data2.error}`);
        }
        else if (!response2.ok) {
            throw new Error(`Generic Error: ${data2.error}`);
        }
    }

    return data; // Return the response data which includes success status and card details
  } catch (error) {
    console.error('Error checking answer:', error);
    throw error;
  }
}

// Update the game with match result and cards obtained ( PUT /api/users/:userId/matches/:matchId )
const UpdateGame = async (UserId, MatchId, matchResult, cardsObtained) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/users/${UserId}/matches/${MatchId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ matchResult, cardsObtained }),
        });
        const data = await response.json();
        
        if (response.status === 400) {
            throw new Error(`Update not valid: ${data.error}`);
        }
        else if (response.status === 404) {
            throw new Error(`Match not found: ${data.error}`);
        }
        else if (response.status === 500) {
            throw new Error(`Server error: ${data.error}`);
        }
        else if (!response.ok) {
            throw new Error(`Generic Error: ${data.error}`);
        }
        return data;
    } catch (error) {
        console.error('Error updating game:', error);
        throw error;
    }
} 

// Update the round with card resul in case of timeout ( POST /api/matches/:matchId/rounds )
const UpdateRound = async (CardId, MatchId, roundNumber) => {
    const cards = [
        {CardId: CardId, RoundResult: 0, roundNumber: roundNumber}
    ]

    const response2 = await fetch(`${SERVER_URL}/api/matches/${MatchId}/rounds`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cards}), 
        credentials: 'include'
    });
    const data2 = await response2.json();

    if (response2.status === 400) {
        throw new Error(`Error creating round: ${data2.error}`);
    }
    else if (response2.status === 404) {
        throw new Error(`Not found: ${data2.error}`);
    }
    else if (response2.status === 500) {
        throw new Error(`Server error: ${data2.error}`);
    }
    else if (!response2.ok) {
        throw new Error(`Generic Error: ${data2.error}`);
    }
}

// Get the cards played in a round ( GET /api/matches/:matchId/rounds )
const getRoundCards = async (MatchId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/matches/${MatchId}/rounds`, 
            {
                credentials: 'include',
            }
        );
        const data = await response.json();

        if (response.status === 400) {
            throw new Error(`Round cards not valid: ${data.error}`);
        }
        else if (response.status === 404) {
            throw new Error(`Round not found: ${data.error}`);
        }
        else if (response.status === 500) {
            throw new Error(`Server error: ${data.error}`);
        }
        else if (!response.ok) {
            throw new Error(`Generic Error: ${data.error}`);
        }

        return data;
    } 
    catch (error) {
        console.error('Error getting round cards:', error);
        throw error;
    }
}

// Get the current user ( GET /api/session/current )
const getCurrentUser = async () => {
    const response = await fetch(`${SERVER_URL}/api/session/current`, {
        credentials: 'include',
    });
    if (!response.ok) throw new Error("Not authenticated");
    return res.json();

        
}

// Login a user ( POST /api/login )
const Login = async (email, password) => {
    const bodyObject = {
        email: email,
        password: password
    }
    const response = await fetch(SERVER_URL + `/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyObject)
    })
    if (response.ok) {
        const user = await response.json();
        return user;

    } else {
        const err = await response.text()
        throw err;
    }
}

// Logout a user ( POST /api/logout )
const Logout = async () => {
    const response = await fetch(`${SERVER_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    if (response.ok) {
        return null; // Logout successful
    } 
    
}

const API = {startNewGame, getInitialCards, getCard, getCardDemo, CheckAnswer, UpdateGame, UpdateRound, getRoundCards, getCurrentUser, Login, Logout};
export default API;
