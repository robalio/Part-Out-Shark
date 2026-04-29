import { useState, useContext } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import loginStatusContext from '../loginStatusContext';

function Register() {

    const { setUser } = useContext(loginStatusContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');



    function handleField(e) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm) {
            setError('Passwords do not match.');
            return;
        }


        // Load existing users
        const users = JSON.parse(localStorage.getItem('pos_users') || '[]');

        if (users.find(u => u.email === formData.email)) {
            setError('An account with that email already exists.');
            return;
        }

        const newUser = {
            id: crypto.randomUUID(),
            username: formData.username,
            email: formData.email,
            password: formData.password,
        };

        localStorage.setItem('pos_users', JSON.stringify([...users, newUser]));

        const { password, ...safeUser } = newUser;
        setUser(safeUser);
        navigate('/');
    }

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: 480 }} className="shadow-sm p-4">
                <h2 className="mb-4">Create an Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" value={formData.username} onChange={handleField} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleField} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={formData.password} onChange={handleField} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" name="confirm" value={formData.confirm} onChange={handleField} required />
                    </Form.Group>
                    <Button type="submit" variant="danger" className="w-100">Sign Up</Button>
                </Form>
                <p className="mt-3 text-center">
                    Already have an account? <NavLink to="/login">Log In</NavLink>
                </p>
            </Card>
        </Container>
    );

}

export default Register;