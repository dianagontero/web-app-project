import { useEffect, useState } from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { Button } from "react-bootstrap"
import { Link, Outlet, useLocation } from "react-router"
import { User } from 'lucide-react'

function Header() {

    return (
        <>
        <Navbar style={{ backgroundColor: '#0d6efd' }} variant="dark" expand="lg">
            <Container fluid>
                 <Link to='/'>
                    <h1 style={{ color: 'white' }}>STUFF happens</h1>
                </Link>

                <Link to={'/Login'}>
                    <Button variant="light">
                        <User size={20} className="me-1" /> Login
                    </Button>
                </Link>
            </Container>
        </Navbar>
        <Outlet />
        </>
    )
}

export default Header