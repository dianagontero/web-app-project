import { useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import { UserContext } from './UserContext.jsx';
import { Button, Card } from "react-bootstrap";
import { Trophy, XCircle } from "lucide-react";

function MatchResult() {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { cards } = location.state;

    let gameResult;
    if (user) {
        gameResult = cards && cards.length === 6 ? 1 : 0;
    }
    else {
        gameResult = cards && cards.length === 4 ? 1 : 0;
    }

    const handleNewGame = () => {
        navigate("/GameIntro");
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "calc(100vh - 120px)", paddingTop: "32px", paddingBottom: "32px" }}>
            <Card className="shadow-lg p-4" style={{ maxWidth: 900, width: "100%", borderRadius: "1.5rem", background: "#fffbe6", minHeight: 350, marginTop: 24, marginBottom: 24 }}>
                <div className="text-center mb-3">
                    {gameResult === 1 ? (
                        <>
                            <Trophy size={48} color="#43c6ac" className="mb-2" />
                            <h2 style={{ color: "#43c6ac", fontWeight: "bold" }}>VICTORY!</h2>
                            <p style={{ color: "#0d6efd", fontSize: "1.2rem", fontWeight: "bold" }}>
                                {user
                                    ? "You guessed all the cards! Congratulations!"
                                    : "You guessed the right card! Well done!"}
                            </p>
                        </>
                    ) : (
                        <>
                            <XCircle size={48} color="#dc3545" className="mb-2" />
                            <h2 style={{ color: "#dc3545", fontWeight: "bold" }}>GAME OVER!</h2>
                            <p style={{ color: "#dc3545", fontSize: "1.2rem", fontWeight: "bold" }}>
                                {user
                                    ? "You didn't guess all the cards. Try again, you'll be luckier next time!"
                                    : "You didn't guess the right card. Try again, you'll be luckier next time!"}
                            </p>
                        </>
                    )}
                </div>
                <div className="d-flex justify-content-center mb-3">
                    <Button variant="primary" size="lg" onClick={handleNewGame} style={{ borderRadius: "2rem", fontWeight: "bold" }}>
                        Start a new game
                    </Button>
                </div>
                
                {user && cards && (
                    // Display the cards owned by the user is user is logged in
                    <div className="row justify-content-center">
                        {cards.map((card) => (
                            <div key={card.CardId} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <div className="card h-100 shadow" style={{ borderRadius: "1rem" }}>
                                    <img
                                        src={`http://localhost:3001/images/${card.url}`}
                                        alt={card.title}
                                        className="card-img-top"
                                        style={{ maxHeight: "160px", objectFit: "contain", background: "#fff", borderRadius: "1rem 1rem 0 0" }}/>
                                    <div className="card-body text-center">
                                        <h5 className="card-title" style={{ color: "#0d6efd", fontWeight: "bold" }}>{card.title}</h5>
                                        <p className="card-text" style={{ color: "#d63384", fontWeight: "bold" }}>
                                             Level: {card.level}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
export default MatchResult;