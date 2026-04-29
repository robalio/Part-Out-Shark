import { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import loginStatusContext from '../loginStatusContext';
import { useNavigate } from 'react-router-dom';

function AccountPage({ onUpdate }) {
    const { user } = useContext(loginStatusContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.username || '');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <h2>You are not logged in.</h2>
                <Button variant="danger" onClick={() => navigate('/login')}>Log In</Button>
            </Container>
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim()) {
            setError('Username cannot be empty.');
            return;
        }

        onUpdate({ ...user, username: username.trim() });
        setSuccess('Username updated successfully.');
    }

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card style={{ width: 480 }} className="shadow-sm p-4">
                <h2 className="mb-1">Account</h2>
                <p className="text-muted mb-4">{user.email}</p>

                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="username">Username</Form.Label>
                        <Form.Control
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter new username"
                        />
                    </Form.Group>
                    <Button type="submit" variant="danger" className="w-100">Save Changes</Button>
                </Form>
            </Card>
        </Container>
    );
}

export default AccountPage;