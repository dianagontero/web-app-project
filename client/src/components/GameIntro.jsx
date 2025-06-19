import React, { useContext } from "react";
import { useNavigate  } from "react-router";
import API from '../API'; // Import the API module to interact with the backend
import { UserContext } from './UserContext.jsx';
import { Card, Button, Spinner } from "react-bootstrap"; // Import Bootstrap components for styling
import { PlayCircle } from 'lucide-react'; // Import Lucide icons for the play button
function GameIntro(props) {
    const { user } = useContext(UserContext); // Access the user context to check if the user is logged in
    
    const {gameID, setGameID, cards, setCards, setWrongGuesses, setNewCard} = props; 

    const [loading, setLoading] = React.useState(false); // Loading state for the button
    const [errorMsg, setErrorMsg] = React.useState(null); // Error message
    
    const navigate = useNavigate(); 

    React.useEffect(() => { 
        if (gameID) { 
            navigate(`/${gameID}`, { state: { cards } });
        }
    }, [gameID]);

    // start a new game 
    const handleStartGame = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const game = await API.startNewGame(user?user.id:0); //post a game in db
            const data = await API.getInitialCards(game, user?user.id:0); // get 3 cards from db + post them in RoundCard table if logged in user
            const sortedCards = data.sort((a, b) => a.level - b.level);
            setCards(sortedCards); 
            setWrongGuesses(0); 
            setNewCard(null); 
            setGameID(game); 
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return(
    <>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
             <Card
                className="shadow-lg"
                style={{ maxWidth: "600px", width: "100%", minHeight: "340px", borderRadius: "2rem", background: "linear-gradient(135deg, #f8fafc 70%, #fffbe6 100%)", boxShadow: "0 8px 24px rgba(13,110,253,0.13)", padding: "2.5rem 2rem"}}>
                <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
                <PlayCircle size={60} color="#0d6efd" className="mb-3" />
                <Card.Title style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#0d6efd", marginBottom: "1.2rem" }}>
                    Ready to play?
                </Card.Title>
                <Card.Text style={{ fontSize: "1.2rem", color: "#495057", marginBottom: "2.2rem" }}>
                    Drag and drop the cards in the correct order to win.<br />
                    You have limited guesses and time for each card.<br />
                    Good luck!
                </Card.Text>
                <Button
                    className="btn btn-danger px-5 py-3 fs-4"
                    onClick={handleStartGame}
                    disabled={loading}
                    style={{borderRadius: "2rem", fontWeight: "bold", fontSize: "1.3rem", letterSpacing: "0.4px", minWidth: "260px", boxShadow: "0 2px 8px rgba(213, 32, 50, 0.15)" }}>
                    {loading ? (
                    <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Loading cards...
                    </>
                    ) : (
                    <> Click to draw your starting cards </>
                    )}
                </Button>
                </Card.Body>
            </Card>
        </div>
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
    </>
    );
} 
export default GameIntro;

