import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import ListingCard from '../components/ListingCard';


function Listings({ listings }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = listings.filter(l => {
    const q = search.toLowerCase();
    return (
      l.year?.toLowerCase().includes(q) ||
      l.make?.toLowerCase().includes(q) ||
      l.model?.toLowerCase().includes(q) ||
      l.trim?.toLowerCase().includes(q) ||
      l.parts?.some(p => p.name.toLowerCase().includes(q))
    );
  });

  if (listings.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h1 style={{ fontSize: '4rem' }}>🦈</h1>
        <h4>No listings yet</h4>
        <p className="text-muted">There are currently no listings.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Listings</h2>
        <Form.Control
          style={{ maxWidth: 300 }}
          placeholder="Search for car parts or title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search listings"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">No listings match your search.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {filtered.map(listing => (
            <ListingCard key={listing.id} listing={listing} />

          ))}
        </Row>
      )}
    </Container>
  );
}

export default Listings;