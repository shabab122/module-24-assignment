import Icon from './Icon.jsx';

export default function Navbar({ totalUsers, favoriteCount, loading, view, onViewChange }) {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <a className="brand" href="/" aria-label="People home">
          <span className="brand-icon"><Icon name="users" size={23} /></span>
          people<span className="brand-dot">.</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <button className={`nav-link${view === 'all' ? ' active' : ''}`} onClick={() => onViewChange('all')} aria-current={view === 'all' ? 'page' : undefined}>
            <Icon name="users" size={18} /> Directory
          </button>
          <button className={`nav-link${view === 'favorites' ? ' active' : ''}`} onClick={() => onViewChange('favorites')} aria-current={view === 'favorites' ? 'page' : undefined}>
            <Icon name="heart" size={18} /> Favorites <span className="nav-count">{favoriteCount}</span>
          </button>
        </nav>
        <div className="total-users"><Icon name="users" size={17} /><span>Total users <strong>{loading ? '…' : totalUsers}</strong></span></div>
      </div>
    </header>
  );
}
