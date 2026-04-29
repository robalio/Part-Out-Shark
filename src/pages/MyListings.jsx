import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ListingCard from '../components/ListingCard';


function MyListings({ myListings }) {
    const navigate = useNavigate();

    if (myListings.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <h1 style={{ fontSize: '4rem' }}>🦈</h1>
                <h4>You have no listings yet!</h4>
                <p className="text-muted">Get started by posting your first part-out.</p>
                <Button variant="danger" onClick={() => navigate('/createListing')}>Create a Listing</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>My Listings</h2>
                <Button variant="danger" onClick={() => navigate('/createListing')}>+ New Listing</Button>
            </div>

            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                {myListings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />

                ))}
            </Row>
        </Container>
    );
}

export default MyListings;