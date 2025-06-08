

function CardsRow(props) {
    const { cards, handleDrop } = props;
    return (
        <div className="d-flex flex-row flex-nowrap align-items-stretch justify-content-center mb-3"
            style={{ overflowX: 'auto', width: '100%' }}>

            {/* Cards already drawn */}
            {cards.map((card, index) => (
                <div key={card.CardId} className="me-3 d-flex flex-column align-items-center" style={{ minWidth: '16rem', maxWidth: '16rem' }}>
                    <div className="card h-100 w-100"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect(); // Get the bounding rectangle of the card
                            const x = e.clientX - rect.left;
                            const width = rect.width;
                            if (x < width / 2) {
                                handleDrop(e, index, cards[index - 1]?.level ?? -1, card.level); // player dropped on the left side
                            }
                            else {
                                handleDrop(e, index+1, card.level, cards[index + 1]?.level ?? 101); // player dropped on the right side
                            }}
                        }>
                        <div className="card-body p-2 text-center d-flex flex-column justify-content-between" style={{ height: '300px' }}>
                            <h6 className="card-title"
                                style={{
                                    color: "#0d6efd", 
                                    fontWeight: "bold",
                                    textShadow: "1px 1px 6px #fff"
                                }}> {card.title}
                            </h6>
                            <img
                                src={card.url}
                                alt={card.title}
                                className="card-img-top mb-2"
                                style={{
                                    maxHeight: '170px',
                                    maxWidth: '100%',
                                    objectFit: 'contain', 
                                    background: '#fff'
                                }}/>
                            <p className="card-text mb-0"
                                style={{
                                    color: "#0d6efd", 
                                    fontWeight: "bold",
                                    textShadow: "1px 1px 6px #fff"
                                }}> <strong>Level:</strong> {card.level}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default CardsRow;