import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import UserCard from './components/UserCard.jsx';
import UserDetails from './components/UserDetails.jsx';
import Icon from './components/Icon.jsx';
import { useUsers } from './hooks/useUsers.js';
import { useFavoritesStore } from './store/favoritesStore.js';
import { filterUsers } from './utils/users.js';

export default function App() {
  const { users, loading, error, retry } = useUsers();
  const favorites = useFavoritesStore((state) => state.favorites);
  const storageError = useFavoritesStore((state) => state.storageError);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

  const [view, setView] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [announcement, setAnnouncement] = useState('');

  const visibleUsers = filterUsers(view === 'favorites' ? favorites : users, query);
  const favoriteIds = new Set(favorites.map((user) => user.id));
  const showLoading = view === 'all' && loading;

  function toggleFavorite(user) {
    if (favoriteIds.has(user.id)) {
      removeFavorite(user.id);
      setAnnouncement(`${user.name} removed from favorites.`);
    } else {
      addFavorite(user);
      setAnnouncement(`${user.name} added to favorites.`);
    }
  }

  return (
    <>
      <a className="skip-link" href="#directory">Skip to directory</a>
      <Navbar totalUsers={users.length} favoriteCount={favorites.length} loading={loading} view={view} onViewChange={setView} />

      <main className="container">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <span className="hero-label"><span className="mini-icon"><Icon name="users" size={15} /></span> A LITTLE MORE CONNECTED</span>
            <h1 id="page-title">Your people,<br /><span>in one place.</span></h1>
            <p>Explore the directory, get to know the details,<br className="desktop-break" /> and keep your favorite people close.</p>
          </div>
          <div className="hero-note">
            <div className="note-icon"><Icon name="heart" size={23} /></div>
            <div><strong>A few favorites go a long way.</strong><p>Save the people you want to find again.<br />They’ll be here when you come back.</p></div>
          </div>
        </section>

        {storageError && <div className="notice notice-warning" role="alert"><Icon name="info" /><span>{storageError}</span></div>}
        {error && <div className="notice notice-error" role="alert"><Icon name="info" /><span>{error}</span><button className="text-button" onClick={retry} disabled={loading}><Icon name="refresh" size={16} />{loading ? 'Retrying…' : 'Try again'}</button></div>}

        <section id="directory" className="directory-section" aria-labelledby="directory-heading">
          <div className="directory-toolbar">
            <div className="directory-heading">
              <h2 id="directory-heading">{view === 'favorites' ? 'Your favorites' : 'The directory'}<span className="count-badge">{view === 'favorites' ? favorites.length : loading ? '…' : users.length}</span></h2>
              <p>{view === 'favorites' ? 'Good people, saved for later.' : 'Find a familiar name or discover someone new.'}</p>
            </div>
            <div className="search-field">
              <Icon name="search" size={19} />
              <label className="sr-only" htmlFor="user-search">Search users by name, email, phone, or company</label>
              <input id="user-search" type="search" placeholder="Search people…" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
              {query && <button className="icon-button search-clear" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
            </div>
          </div>

          {showLoading ? (
            <div className="state-panel" role="status"><span className="spinner" /><h3>Loading users…</h3><p>Getting the directory ready for you.</p></div>
          ) : visibleUsers.length > 0 ? (
            <>
              {query.trim() && <p className="search-summary" role="status">{visibleUsers.length} {visibleUsers.length === 1 ? 'person' : 'people'} found for “{query.trim()}”</p>}
              <div className="user-grid">
                {visibleUsers.map((user) => <UserCard key={user.id} user={user} isFavorite={favoriteIds.has(user.id)} onDetails={setSelectedUser} onToggleFavorite={toggleFavorite} />)}
              </div>
            </>
          ) : !error || view === 'favorites' ? (
            <div className="state-panel">
              <span className="empty-icon"><Icon name={query.trim() ? 'search' : view === 'favorites' ? 'heart' : 'users'} size={28} /></span>
              <h3>{query.trim() ? 'No people found' : view === 'favorites' ? 'Your favorites start here' : 'No users available'}</h3>
              <p>{query.trim() ? 'Try another name, email, phone, or company.' : view === 'favorites' ? 'Tap Favorite on a user card to save someone here.' : 'The directory is empty. Please check back later.'}</p>
              {query.trim() ? <button className="button primary-button" onClick={() => setQuery('')}>Clear search</button> : view === 'favorites' && <button className="button primary-button" onClick={() => setView('all')}>Explore directory</button>}
            </div>
          ) : null}
        </section>

        <footer className="footer"><p><Icon name="heart" size={15} />Favorites stay in this browser.</p><p>Sample people from <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noreferrer">JSONPlaceholder</a></p></footer>
      </main>

      <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      {selectedUser && <UserDetails user={selectedUser} isFavorite={favoriteIds.has(selectedUser.id)} onClose={() => setSelectedUser(null)} onToggleFavorite={toggleFavorite} />}
    </>
  );
}
