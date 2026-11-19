import { useEffect, useRef } from 'react';
import Avatar from './Avatar.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import Icon from './Icon.jsx';

export default function UserDetails({ user, isFavorite, onClose, onToggleFavorite }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const address = user.address;
  const fullAddress = address
    ? [address.suite, address.street, address.city, address.zipcode].filter(Boolean).join(', ')
    : 'Not provided';

  return (
    <dialog ref={dialogRef} className="details-dialog" aria-labelledby="details-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-topline">
          <span className="eyebrow">USER DETAILS</span>
          <button className="icon-button" onClick={onClose} aria-label="Close user details" autoFocus><Icon name="close" /></button>
        </div>
        <div className="modal-profile">
          <Avatar user={user} large />
          <h2 id="details-title">{user.name}</h2>
          <p>{user.username ? `@${user.username}` : 'Directory member'}</p>
        </div>
        <dl className="details-list">
          <div><dt><Icon name="mail" size={18} />Email</dt><dd><a href={`mailto:${user.email}`}>{user.email}</a></dd></div>
          <div><dt><Icon name="phone" size={18} />Phone</dt><dd>{user.phone}</dd></div>
          <div><dt><Icon name="globe" size={18} />Website</dt><dd>{user.website || 'Not provided'}</dd></div>
          <div><dt><Icon name="building" size={18} />Company</dt><dd>{user.company?.name || 'Not provided'}{user.company?.catchPhrase && <span className="detail-secondary">{user.company.catchPhrase}</span>}</dd></div>
          <div><dt><Icon name="pin" size={18} />Address</dt><dd>{fullAddress}</dd></div>
        </dl>
        <div className="modal-footer">
          <span>Keep this person close.</span>
          <FavoriteButton user={user} isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </div>
    </dialog>
  );
}
