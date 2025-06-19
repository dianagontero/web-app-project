import { useState, useContext, useEffect } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { UserContext } from './UserContext.jsx';
import { useNavigate } from "react-router";

function Login() {
  const { login } = useContext(UserContext); // Access the login function from UserContext
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  if (successMsg) {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);
    return () => clearTimeout(timer);
  }
  }, [successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(email, password );
      if (user.success === true) {
        setSuccessMsg('Login successful! Redirecting...');
      } else {
        setErrorMsg('Login failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Error during login:');
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
      <Card style={{ width: '600px', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 16px rgba(223, 203, 18, 0.59)' }}>
        <h2 className="mb-4 text-center" style={{ color: '#0d6efd' }}>Login</h2>
        
        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              name="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Password" 
              name="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}/>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" size="lg" disabled={loading}>
            {loading ? 'Loading...' : 'Submit'}
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default Login
