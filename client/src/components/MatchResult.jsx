import { useLocation } from "react-router";
import API from "../API.mjs";
import { useContext } from "react";
import { UserContext } from './UserContext.jsx';

function MatchResult(){
    const { user } = useContext(UserContext);

    const location = useLocation();
    const {  cards } = location.state || {};
    
    let gameResult;
    if (user) {
        gameResult = cards && cards.length === 6 ? 1 : 0;
    }
    else {
        gameResult = cards && cards.length === 4 ? 1 : 0;
    }
    return (
        <>
             <h2 style={{ color: gameResult === 1 ? "#43c6ac" : "#dc3545", textAlign: "center" }}>
                {gameResult === 1 ? " VICTORY! " : " LOSE! "}
            </h2>
            <div className="row justify-content-center">
                {cards.map((card) => (
                    <div key={card.CardId } className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100 shadow" style={{ borderRadius: "1rem" }}>
                            <img
                                src={card.url}
                                alt={card.title}
                                className="card-img-top"
                                style={{ maxHeight: "160px", objectFit: "contain", background: "#fff", borderRadius: "1rem 1rem 0 0" }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title" style={{ color: "#0d6efd", fontWeight: "bold" }}>{card.title}</h5>
                                <p className="card-text" style={{ color: "#d63384", fontWeight: "bold" }}>
                                    Livello: {card.level}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
export default MatchResult;