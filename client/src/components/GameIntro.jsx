function GameIntro(props) {
    const {loading, handleStartGame} = props;

    return(
    <>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
            <h1 className="mb-3 text-primary text-center"
                style={{
                    fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
                    fontWeight: "bold",
                    fontSize: "3rem",
                    letterSpacing: "2px"
                }}>
                🎲 Let the misfortune begin! 🎲
            </h1>
            <p className="mb-4 text-center"
                style={{
                    fontSize: "1.3rem",
                    color: "#333",
                    maxWidth: "600px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "1rem",
                    padding: "1.2rem 2rem",
                    boxShadow: "0 2px 12px #43c6ac33"
                }}>
                Test your luck and skill by sorting the craziest situations from least to most unfortunate.<br />
                Are you ready to face the unexpected? <br />
                Click below to draw your starting cards!
            </p>
            <div className="d-flex flex-column align-items-center">
                <button className="btn btn-danger mb-4 px-5 py-3 fs-4"
                    onClick={handleStartGame} // Function to start the game
                    disabled={loading} // Disable button while loading
                    style={{
                        borderRadius: "2rem",
                        transition: "transform 0.1s",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        letterSpacing: "1px"
                    }}>
                    {loading ? 'Loading cards...' : '✨ Click to draw your starting cards ✨'}
                </button>
                <span style={{ color: "#888", fontSize: "1.1rem" }}>
                    <i className="bi bi-lightbulb-fill" style={{ color: "#FFD600" }}></i>
                    &nbsp;Tip: Drag and drop the cards in the right order to win!
                </span>
            </div>
        </div>
    </>
    );
} 
export default GameIntro;