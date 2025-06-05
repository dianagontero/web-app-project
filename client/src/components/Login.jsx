import { useEffect, useState } from 'react'
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Link, Outlet, useLocation } from "react-router"
import { User } from 'lucide-react'

function Login(){
    return (
    <Container 
      className="d-flex justify-content-center align-items-center" 
      style={{ height: '90vh' }}>
      <Card style={{ width: '600px', padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 16px rgba(223, 203, 18, 0.59)' }}>
        <h2 className="mb-4 text-center" style={{ color: '#0d6efd' }}>Login</h2>
        
        { (
          <div className="alert alert-success" role="alert">
            Form submitted successfully!
          </div>
        )}
        
        <Form>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              name="email" 
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Password" 
              name="password" 
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" size="lg">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
    )
}

export default Login