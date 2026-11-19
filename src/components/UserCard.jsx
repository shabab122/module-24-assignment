import Avatar from './Avatar.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import Icon from './Icon.jsx';

export default function UserCard({ user, isFavorite, onDetails, onToggleFavorite }) {
  return (
    <article className="user-card" aria-label={user.name}>
      <div className="card-profile">
        <Avatar user={user} />
        <div className="profile-text">
          <h3>{user.name}</h3>
          <span className="username">{user.username ? `@${user.username}` : 'Directory member'}</span>
        </div>
      </div>
      <p className="company"><Icon name="building" size={16} />{user.company?.name || 'Independent'}</p>
      <div className="contact-list">
        <a href={`mailto:${user.email}`} title={user.email}><Icon name="mail" size={18} /><span>{user.email}</span></a>
        <div><Icon name="phone" size={18} /><span>{user.phone}</span></div>
      </div>
      <div className="card-actions">
        <button className="button details-button" onClick={() => onDetails(user)} aria-label={`View details for ${user.name}`}>Details</button>
        <FavoriteButton user={user} isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </article>
  );
}
