const SERVER_URL = 'http://localhost:3001';

// Start a new game logged in ( POST /api/users/:userId/games )
const startNewGame = async (userId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/users/${userId}/matches`, {
            method: 'POST',
            //credentials: 'include'   // invio cookie di sessione
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

const getInitialCards = async (MatchId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/cards/starting`);

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

        const response2 = await fetch(`${SERVER_URL}/api/matches/${MatchId}/rounds`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cards })
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

        return cardsInitial;
    } 
    catch (error) {
        console.error('Error getting initial cards:', error);
        throw error;
    }
}

const getCard = async (MatchId) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/matches/${MatchId}/cards`);

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

const CheckAnswer = async (CardId, levelsx, leveldx) =>{
    try {
    const response = await fetch(`/api/cards/${CardId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ levelsx, leveldx })
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

    return data.resutl;
  } catch (error) {
        console.error('Error checking answer:', error);
    throw error;
  }
}


const API = {startNewGame, getInitialCards, getCard, CheckAnswer};
export default API;
