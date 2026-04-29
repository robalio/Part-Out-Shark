import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ListingCard from '../components/ListingCard';


function SavedListings({ savedListings }) {
    const navigate = useNavigate();

    if (savedListings.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <h1 style={{ fontSize: '4rem' }}>🦈</h1>
                <h4>No saved listings yet.</h4>
                <p className="text-muted">Bookmark a listing while browsing to save it here.</p>
                <Button variant="danger" onClick={() => navigate('/listings')}>Browse Listings</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Saved Listings</h2>
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                {savedListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />

                ))}
            </Row>
        </Container>
    );
}

export default SavedListings;