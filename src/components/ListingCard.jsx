import { useNavigate } from 'react-router-dom';
import { Card, Col } from 'react-bootstrap';

function ListingCard({ listing }) {
    const navigate = useNavigate();

    return (
        <Col>
            <Card
                className="h-100 shadow-sm"
                style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => navigate(`/listings/${listing.id}`)}
            >
                {listing.images.length > 0 ? (
                    <Card.Img
                        variant="top"
                        src={listing.images[0].url}
                        alt={`${listing.year} ${listing.make} ${listing.model}`}
                        style={{ height: 160, objectFit: 'cover' }}
                    />
                ) : (
                    <div
                        className="bg-secondary d-flex align-items-center justify-content-center"
                        style={{ height: 160 }}
                    >
                        <span className="text-white">No Image</span>
                    </div>
                )}
                <Card.Body>
                    <Card.Title className="mb-1">
                        {listing.year} {listing.make} {listing.model}
                    </Card.Title>
                    {listing.trim && (
                        <Card.Subtitle className="text-muted mb-2">{listing.trim}</Card.Subtitle>
                    )}
                    <Card.Text className="small text-muted">
                        {listing.parts.length} part(s) removed
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default ListingCard;