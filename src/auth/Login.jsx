import { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import loginStatusContext from '../loginStatusContext';

function Login() {
    const { setUser } = useContext(loginStatusContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    function handleField(e) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('pos_users') || '[]');
        const match = users.find(u => u.email === formData.email && u.password === formData.password);

        if (!match) {
            setError('Invalid email or password.');
            return;
        }

        const { password, ...safeUser } = match;
        setUser(safeUser);
        navigate('/');
    }

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: 480 }} className="shadow-sm p-4">
                <h2 className="mb-4">Log In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleField} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleField} required />
                    </Form.Group>
                    <Button type="submit" variant="danger" className="w-100">Log In</Button>
                </Form>
                <p className="mt-3 text-center">
                    No account? <NavLink to="/register">Sign Up</NavLink>
                </p>
            </Card>
        </Container>
    );
}

export default Login;