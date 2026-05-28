import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Form } from 'react-bootstrap';
import { useState, useContext } from 'react';
import loginStatusContext from '../loginStatusContext';

function Details({ listings, onDelete, onUpdate, savedIds, onToggleSaved }) {

    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(loginStatusContext);
    const [photoIndex, setPhotoIndex] = useState(0);
    const [newPart, setNewPart] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState('');

    const listing = listings.find(l => l.id === id);

    if (!listing) {
        return (
            <Container className="mt-5 text-center">
                <h2>Listing not found.</h2>
                <Button variant="danger" onClick={() => navigate('/listings')}>Back to Listings</Button>
            </Container>
        );
    }

    const isOwner = user && user.id === listing.userId;
    const isSaved = savedIds.includes(listing.id);
    const hasImages = listing.images && listing.images.length > 0;

    function handleDelete() {
        if (window.confirm(`Delete listing for ${listing.year} ${listing.make} ${listing.model}?`)) {
            onDelete(listing.id);
            navigate('/myListings');
        }
    }

    function handleAddPart() {
        if (!newPart.trim()) return;
        onUpdate({ ...listing, parts: [...listing.parts, { id: crypto.randomUUID(), name: newPart.trim() }] });
        setNewPart('');
    }

    function handleDeletePart(partId) {
        onUpdate({ ...listing, parts: listing.parts.filter(p => p.id !== partId) });
    }

    function handleStartEditing() {
        setDescriptionDraft(listing.description || '');
        setEditingDescription(true);
    }

    function handleSaveDescription() {
        onUpdate({ ...listing, description: descriptionDraft });
        setEditingDescription(false);
    }

    function nextPhoto() {
        setPhotoIndex(prev => (prev + 1) % listing.images.length);
    }

    function prevPhoto() {
        setPhotoIndex(prev => (prev - 1 + listing.images.length) % listing.images.length);
    }

    return (
        <Container className="mt-4">

            {/* Action buttons */}
            <div className="mb-3">
                <Button variant="danger" onClick={() => navigate(-1)}>← Back</Button>
                {isOwner && (
                    <Button variant="danger" className="ms-2" onClick={handleDelete}>Delete Listing</Button>
                )}
                {user && !isOwner && (
                    <Button
                        variant={isSaved ? 'warning' : 'outline-warning'}
                        className="ms-2"
                        onClick={() => onToggleSaved(listing.id)}
                    >
                        {isSaved ? '★ Saved' : '☆ Save'}
                    </Button>
                )}
            </div>

            {/* Title */}
            <h2>{listing.year} {listing.make} {listing.model} {listing.trim}</h2>
            <p className="text-muted">Posted by {listing.postedBy}</p>

            <Row>
                {/* Left col: photos + description */}
                <Col md={7}>
                    {hasImages ? (
                        <div className="mb-3">
                            <img
                                src={listing.images[photoIndex].url}
                                alt={`${listing.year} ${listing.make} ${listing.model} - photo ${photoIndex + 1} of ${listing.images.length}`}
                                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: '8px', cursor: listing.images.length > 1 ? 'pointer' : 'default' }}
                                onClick={listing.images.length > 1 ? nextPhoto : undefined}
                            />
                            {listing.images.length > 1 && (
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <Button variant="outline-secondary" size="sm" onClick={prevPhoto}>← Prev</Button>
                                    <span className="text-muted small">{photoIndex + 1} / {listing.images.length}</span>
                                    <Button variant="outline-secondary" size="sm" onClick={nextPhoto}>Next →</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-secondary d-flex align-items-center justify-content-center mb-3" style={{ height: 300, borderRadius: '8px' }}>
                            <span className="text-white">No Images</span>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h3 className="mb-0">Description</h3>
                            {isOwner && !editingDescription && (
                                <Button variant="outline-secondary" size="sm" onClick={handleStartEditing}>Edit</Button>
                            )}
                        </div>
                        {editingDescription ? (
                            <>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={descriptionDraft}
                                    onChange={e => setDescriptionDraft(e.target.value)}
                                    aria-label="Edit description"
                                />
                                <div className="d-flex gap-2 mt-2">
                                    <Button variant="danger" size="sm" onClick={handleSaveDescription}>Save</Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => setEditingDescription(false)}>Cancel</Button>
                                </div>
                            </>
                        ) : (
                            <p style={{ whiteSpace: 'pre-wrap' }}>
                                {listing.description || <span className="text-muted">No description available.</span>}
                            </p>
                        )}
                    </div>
                </Col>

                {/* Right col: parts */}
                <Col md={5}>
                    <h3>Removed Parts <Badge bg="secondary">{listing.parts.length}</Badge></h3>
                    {listing.parts.length > 0 ? (
                        <ul className="list-group mb-3">
                            {listing.parts.map(part => (
                                <li key={part.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    {part.name}
                                    {isOwner && (
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeletePart(part.id)}>✕</Button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No parts removed yet.</p>
                    )}
                    {isOwner && (
                        <div className="d-flex gap-2 mt-2">
                            <Form.Control
                                placeholder="e.g. Driver door"
                                value={newPart}
                                onChange={e => setNewPart(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddPart()}
                                aria-label="New part name"
                            />
                            <Button variant="danger" onClick={handleAddPart}>Add</Button>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Details;