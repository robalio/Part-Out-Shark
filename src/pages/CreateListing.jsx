import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, ListGroup, Alert, Card } from 'react-bootstrap';
import loginStatusContext from '../loginStatusContext';

function CreateListing({ onSubmit }) {
  const navigate = useNavigate();
  const { user } = useContext(loginStatusContext);

  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    trim: '',
    description: '',
    images: [],
    parts: [{ id: crypto.randomUUID(), name: '', sold: false }],
  });

  function handleField(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleImages(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, {
            id: crypto.randomUUID(),
            url: reader.result,  //saves images in localstorage
            name: file.name,
          }]
        }));
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(id) {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }));
  }

  function addPart() {
    setFormData(prev => ({
      ...prev,
      parts: [...prev.parts, { id: crypto.randomUUID(), name: '', sold: false }],
    }));
  }

  function updatePart(id, value) {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.map(p => p.id === id ? { ...p, name: value } : p),
    }));
  }

  function removePart(id) {
    setFormData(prev => ({ ...prev, parts: prev.parts.filter(p => p.id !== id) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const listing = {
      id: crypto.randomUUID(),
      userId: user.id,
      postedBy: user.username,
      ...formData,
      createdAt: Date.now(),
    };
    onSubmit(listing);
    navigate('/myListings');
  }

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">You must be logged in to create a listing.</Alert>
        <Button onClick={() => navigate('/login')}>Log In</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card className="shadow-sm p-4 w-100" style={{ maxWidth: 800 }}>
        <h2 className="mb-4">Create a Listing</h2>
        <Form onSubmit={handleSubmit}>

          <Row className="mb-3">
            <Col>
              <Form.Label>Year</Form.Label>
              <Form.Control name="year" value={formData.year} onChange={handleField} placeholder="e.g. 2001" required />
            </Col>
            <Col>
              <Form.Label>Make</Form.Label>
              <Form.Control name="make" value={formData.make} onChange={handleField} placeholder="e.g. Honda" required />
            </Col>
            <Col>
              <Form.Label>Model</Form.Label>
              <Form.Control name="model" value={formData.model} onChange={handleField} placeholder="e.g. Civic" required />
            </Col>
            <Col>
              <Form.Label>Trim</Form.Label>
              <Form.Control name="trim" value={formData.trim} onChange={handleField} placeholder="e.g. EX" />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Images</Form.Label>
            <Form.Control type="file" accept="image/*" multiple onChange={handleImages} />
            {formData.images.length > 0 && (
              <ListGroup className="mt-2">
                {formData.images.map(img => (
                  <ListGroup.Item key={img.id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <img src={img.url} alt={img.name} style={{ height: 48, width: 64, objectFit: 'cover' }} />
                      <span>{img.name}</span>
                    </div>
                    <Button variant="outline-danger" size="sm" onClick={() => removeImage(img.id)}>Remove</Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleField}
              placeholder="Please use this space to include any important or additional information you'd like."
            />
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Parts no longer on the vehicle</Form.Label>
            <Form.Text className="d-block text-muted mb-2">
              List every part no longer on the vehicle. This can be updated and changed as parts are purchased from your vehicle.
            </Form.Text>
            {formData.parts.map((part, index) => (
              <Row key={part.id} className="mb-2">
                <Col>
                  <Form.Control
                    value={part.name}
                    onChange={e => updatePart(part.id, e.target.value)}
                    placeholder={`Part ${index + 1} — e.g. Driver door`}
                    aria-label={`Part ${index + 1} name`}   // ← add this
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => removePart(part.id)}
                    disabled={formData.parts.length === 1}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addPart}>+ Add Part</Button>
          </Form.Group>

          <Button type="submit" variant="primary">Post Listing</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CreateListing;