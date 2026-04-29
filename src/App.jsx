import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import loginStatusContext from './loginStatusContext'
import Navbar from './components/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import CreateListing from './pages/CreateListing'
import Listings from './pages/Listings'
import MyListings from './pages/MyListings'
import Login from './auth/Login'
import Register from './auth/Register'
import About from './pages/About'
import SavedListings from './pages/SavedListings'
import Details from './pages/Details'
import AccountPage from './pages/AccountPage'



function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function App() {
  const [user, setUser] = useState(() => loadFromStorage('pos_user', null));
  const [listings, setListings] = useState(() => loadFromStorage('pos_listings', []));
  const [savedIds, setSavedIds] = useState(() =>
    user ? loadFromStorage(`pos_saved_${user.id}`, []) : []
  );

  function handleSetUser(newUser) {
    setUser(newUser);
    saveToStorage('pos_user', newUser);
    setSavedIds(newUser ? loadFromStorage(`pos_saved_${newUser.id}`, []) : []);
  }

  function addListing(listing) {
    const updated = [listing, ...listings];
    setListings(updated);
    saveToStorage('pos_listings', updated);
  }

  function deleteListing(id) {
    const updated = listings.filter(l => l.id !== id);
    setListings(updated);
    saveToStorage('pos_listings', updated);
  }

  function updateListing(updatedListing) {
    const updated = listings.map(l => l.id === updatedListing.id ? updatedListing : l);
    setListings(updated);
    saveToStorage('pos_listings', updated);
  }

  function toggleSaved(listingId) {
    if (!user) return;
    const updated = savedIds.includes(listingId)
      ? savedIds.filter(id => id !== listingId)
      : [...savedIds, listingId];
    setSavedIds(updated);
    saveToStorage(`pos_saved_${user.id}`, updated);
  }

  function updateUser(updatedUser) {
    // Update the session
    handleSetUser(updatedUser);
    // Update postedBy on all their listings
    const updatedListings = listings.map(l =>
      l.userId === updatedUser.id ? { ...l, postedBy: updatedUser.username } : l
    );
    setListings(updatedListings);
    saveToStorage('pos_listings', updatedListings);
    // Update the stored users list
    const users = JSON.parse(localStorage.getItem('pos_users') || '[]');
    const updatedUsers = users.map(u => u.id === updatedUser.id ? { ...u, username: updatedUser.username } : u);
    localStorage.setItem('pos_users', JSON.stringify(updatedUsers));
  }

  const savedListings = listings.filter(l => savedIds.includes(l.id));
  const myListings = user ? listings.filter(l => l.userId === user.id) : [];

  return (
    <loginStatusContext.Provider value={{ user, setUser: handleSetUser }}>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="*" element={<Navigate to="/listings" replace />} />
          <Route path="/listings" element={<Listings listings={listings} />} />
          <Route path="/listings/:id" element={<Details listings={listings} onDelete={deleteListing} onUpdate={updateListing} savedIds={savedIds} onToggleSaved={toggleSaved} />} />
          <Route path="/savedlistings" element={<SavedListings savedListings={savedListings} />} />
          <Route path="/mylistings" element={<MyListings myListings={myListings} />} />
          <Route path="/createlisting" element={<CreateListing onSubmit={addListing} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/accountpage" element={<AccountPage onUpdate={updateUser} />} />
        </Routes>
      </HashRouter>
    </loginStatusContext.Provider>
  )
}

export default App