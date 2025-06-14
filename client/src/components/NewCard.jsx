
function NewCard(props) {
    const { getNewCard, loading, newCard, activeTimer, timer } = props;
    return (
        <>
            <div className="d-flex flex-row align-items-center justify-content-center gap-4" style={{ marginTop: "2rem" }}>
                <button className="btn btn-outline-danger px-5 py-3 fs-4"
                    onClick={getNewCard} // Function to get a new card
                    disabled={loading || newCard !== null}
                    style={{
                        borderRadius: "2rem",
                        boxShadow: "0 2px 8px rgba(213, 32, 50, 0.5)",
                        fontWeight: "bold",
                        fontSize: "1.3rem",
                        letterSpacing: "1px",
                        minWidth: "260px"
                    }}>
                    {loading ? 'Loading...' : 'Draw new situation'} 
                </button>
                {activeTimer && (
                    <div style={{
                        fontSize: "2.2rem",
                        fontWeight: "bold",
                        color: timer <= 5 ? "#dc3545" : "#0d6efd",
                        textShadow: timer <= 5 ? "0 0 10px #dc3545" : "0 0 6px #0d6efd",
                        transition: "color 0.3s, text-shadow 0.3s",
                        letterSpacing: "2px",
                        background: "rgba(250, 249, 247, 0.8)",
                        borderRadius: "1rem",
                        padding: "0.5rem 2.5rem",
                        border: timer <= 5 ? "2px solid #dc3545" : "2px solid #0d6efd",
                        boxShadow: "0 2px 12px #43c6ac33",
                        marginLeft: "1.5rem"
                    }}> {timer}s
                    </div>
                )}
            </div>
            {newCard && (
                RenderNewCard({ newCard }) // Render the new card if it exists
            )}
        </>
    )
}

function RenderNewCard(props) {
    const { newCard } = props;
    return (
        <div className="mt-4 text-center">
            <h2 className="mb-4"
                style={{
                    color: "#FFD600",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    textShadow: "1px 1px 8pxrgb(235, 220, 13), 0 2px 8px #fff",
                    fontSize: "2.2rem",
                    fontFamily: "'Comic Sans MS', 'Comic Sans', cursive"
                }}> ✨🃏 New Situation! 🃏✨
            </h2>
            <div className="card mx-auto"
                style={{ width: '18rem' }}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', JSON.stringify(newCard));
                }}>
                <div className="card-body text-center">
                    <h5 className="card-title"
                        style={{
                            color: "#0d6efd",
                            fontWeight: "bold",
                            textShadow: "1px 1px 6px #fff"
                        }}>{newCard.title}
                    </h5>

                    <img src={`http://localhost:3001/images/${newCard.url}`}
                        alt={newCard.title}
                        className="card-img-top mb-2"
                        style={{
                            maxHeight: '170px',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            background: '#fff'
                        }}/>
                    <p className="card-text mb-0">
                        <strong style={{ color: "#dc3545" }}>Level: ?</strong> {newCard.level}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NewCard;