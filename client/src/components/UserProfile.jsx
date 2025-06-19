import { useEffect, useState, useContext } from "react";
import API from "../API.mjs";
import { UserContext } from "./UserContext";
import { Spinner, Alert, Table, Badge, OverlayTrigger, Tooltip, Card} from "react-bootstrap";
import { Clock, Trophy, XCircle, MinusCircle, UserIcon, Mail } from "lucide-react";

function UserProfile() {
  const { user } = useContext(UserContext);

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        if (!user) {
          setErrorMsg("You must be logged in to view your history.");
          setLoading(false);
          return;
        }
        const data = await API.getMatches(user.id); //get matches for the logged in user
        setMatches(data);
      } catch (err) {
        setErrorMsg("Error loading history: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [user]);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (errorMsg) return <Alert variant="danger">{errorMsg}</Alert>;
  if (matches.length===0) return <Alert variant="info">You haven't played any matches yet!</Alert>;

  return (
    <>
    { user &&
    <><div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
          <Card
            style={{ maxWidth: 500, width: "100%", borderRadius: "1.5rem", boxShadow: "0 8px 24px rgba(13,110,253,0.13)", background: "#f8f9fa" }}
            className="mb-4">
            <Card.Body className="text-center">
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.2rem" }}>
                <UserIcon size={56} color="#0d6efd" style={{ background: "#e7f1ff", borderRadius: "50%", padding: "0.7rem" }} />
                <div style={{ fontWeight: "bold", fontSize: "2rem", color: "#0d6efd", marginTop: "0.7rem" }}>
                  <span style={{ fontSize: "1.1rem", color: "#495057", fontWeight: "normal" }}>Nome: </span>
                  {user.name}
                  <span style={{ fontSize: "1.1rem", color: "#495057", fontWeight: "normal", marginLeft: "1.2rem" }}>Cognome: </span>
                  {user.surname}
                </div>
              </div>
              <hr style={{ margin: "1.5rem 0" }} />
              <div style={{ fontSize: "1.1rem", color: "#495057" }}>
                <div className="mb-3" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <Mail size={20} color="#d63384" />
                  <span style={{ fontWeight: "bold" }}>Email:</span>
                  <span>{user.email}</span>
                </div>
                {/* Puoi aggiungere altri dati utente qui */}
              </div>
            </Card.Body>
          </Card>
        </div><div className="container py-4">
            <h2 className="mb-4 text-center" style={{ color: "#0d6efd", fontWeight: "bold", letterSpacing: "1px" }}>
              <Clock size={28} className="mb-1" /> Game History
            </h2>
            <Table striped bordered hover responsive className="shadow-sm rounded" style={{ background: "#fff" }}>
              <thead style={{ background: "#f0c419", color: "#0d6efd", fontWeight: "bold", fontSize: "1.1rem" }}>
                <tr>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Cards Obtained</th>
                  <th>Cards Played</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, idx) => (
                  <tr key={idx} style={{ verticalAlign: "middle" }}>
                    <td style={{ fontWeight: "bold" }}>{new Date(match.Date).toLocaleString()}</td>
                    <td>
                      {match.MatchResult === 1 ? (
                        <Badge bg="success" className="px-3 py-2 fs-6">
                          <Trophy size={16} className="mb-1" /> Win
                        </Badge>
                      ) : (
                        <Badge bg="danger" className="px-3 py-2 fs-6">
                          <XCircle size={16} className="mb-1" /> Lose
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge bg="info" className="px-3 py-2 fs-6">
                        {match.cardsObtained}
                      </Badge>
                    </td>
                    <td>
                      {match.MatchCards && match.MatchCards.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                          {(() => {
                            return match.MatchCards.map((card, i) => (
                              <OverlayTrigger
                                key={i}
                                placement="top"
                                overlay={<Tooltip>
                                  {card.result === 1
                                    ? "Guessed right"
                                    : card.result === 0
                                      ? "Wrong guess"
                                      : "Initial card"}
                                </Tooltip>}>
                                <span>
                                  <Badge
                                    bg={card.result === 1
                                      ? "success"
                                      : card.result === 0
                                        ? "danger"
                                        : "secondary"}
                                    className="px-2 py-2"
                                    style={{ fontSize: "1rem", minWidth: "2.5rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                                    {card.title}{" "}
                                    {card.result === 1 ? (
                                      <Trophy size={16} style={{ marginBottom: "2px" }} />
                                    ) : card.result === 0 ? (
                                      <XCircle size={16} style={{ marginBottom: "2px" }} />
                                    ) : (
                                      <MinusCircle size={16} style={{ marginBottom: "2px" }} />
                                    )}

                                    {card.result !== -1 && (
                                      <span style={{ marginLeft: 6, fontWeight: "bold" }}>
                                        #{card.roundNumber}
                                      </span>
                                    )}
                                  </Badge>
                                </span>
                              </OverlayTrigger>
                            ));
                          })()}
                        </div>
                      ) : (
                        <span>No cards</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div></>
        }
    </>
  );

}

export default UserProfile;