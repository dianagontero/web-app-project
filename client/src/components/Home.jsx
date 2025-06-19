import { useContext } from 'react'
import { Container, Card } from 'react-bootstrap'
import { Button } from "react-bootstrap"
import { Link} from "react-router"
import { BookOpen, PlayCircle, MonitorPlay, History as HistoryIcon } from 'lucide-react';
import { UserContext } from "./UserContext"; 

function Home() {

  const { user } = useContext(UserContext); 
  
  return (
    <>
     <Container 
      className="d-flex flex-column align-items-center justify-content-center text-center" 
      style={{ height: '80vh', gap: '2rem' }}>
      <Card style={{ maxWidth: '500px', width: '90vw', minHeight: '300px', padding: '3.5rem', borderRadius: '2rem', boxShadow: '0 8px 16px rgba(239, 185, 7, 0.66)'}}>
        <Card.Body>
          <Card.Title style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0d6efd' }}>
            Welcome to <br /> <strong style={{ color: '#f0c419' }}>STUFF happens</strong>
          </Card.Title>
          
          <Link to="/Rules" style={{ textDecoration: 'none' }}>
            <Button variant="outline-primary" size="lg" className="mb-4 d-flex align-items-center gap-2"   style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
              <BookOpen size={26} />
                Read the game rules
            </Button>
          </Link>
          
          <div className="d-flex gap-3 justify-content-center">
            {user ? (
            <Link to="/GameIntro">
              <Button variant="primary" size="md" className="d-flex align-items-center gap-2"
                style={{fontSize: "1.2rem", padding: "0.7rem 1.5rem", borderRadius: "1rem", fontWeight: "bold"}}>
                <PlayCircle size={24} />
                    Start a game
              </Button>
            </Link>
            ) : (
            <Link to="/GameIntro">
              <Button variant="secondary" size="md" className="d-flex align-items-center gap-2"
              style={{fontSize: "1.2rem", padding: "0.7rem 1.5rem", borderRadius: "1rem", fontWeight: "bold"}}>
                <MonitorPlay size={20} />
                    Demo game
              </Button>
            </Link>
            )}
          </div>

          {user && (
            <div className="mt-3">
              <Link to="/UserProfile" 
                style={{textDecoration: "none", color: "#f0c419", fontWeight: "bold", fontSize: "1.3rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", transition: "color 0.2s"}}
                onMouseOver={e => e.currentTarget.style.color = "#0d6efd"}
                onMouseOut={e => e.currentTarget.style.color = "#f0c419"}>
                <HistoryIcon size={22} />
                View your game history
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
    </>
  );
}

export default Home