import { useContext } from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { Button } from "react-bootstrap"
import { Link, Outlet, useLocation } from "react-router"
import { User } from 'lucide-react'
import { UserContext } from "./UserContext";

function Header(props) {
    const { gameID, setGameID } = props;
    const { user, logout } = useContext(UserContext);
    return (
        <>
        <Navbar style={{ backgroundColor: '#0d6efd' }} variant="dark" expand="lg">
            <Container fluid>
                {gameID ? (
                    <h1 style={{ color: 'white', opacity: 0.7, cursor: "not-allowed" }}>STUFF happens</h1>
                ) : (
                    <Link to='/'>
                        <h1 style={{ color: 'white' }}>STUFF happens</h1>
                    </Link>
                )}

                { gameID ? (
                    <Button variant="light" disabled style={{ opacity: 0.7, pointerEvents: "none" }}>
                        <User size={20} className="me-1" /> {user ? "Logout" : "Login"}
                    </Button>
                ) : user ? (
                    <Button variant="light" onClick={logout}>
                        <User size={20} className="me-1" /> Logout
                    </Button>
                ) : (
                <Link to={'/Login'}>
                    <Button variant="light">
                        <User size={20} className="me-1" /> Login
                    </Button>
                </Link>
                )}   
            </Container>
        </Navbar>
        <Outlet />
        </>
    )
}

export default Header