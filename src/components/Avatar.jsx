import { getInitials } from '../utils/users.js';

export default function Avatar({ user, large = false }) {
  return (
    <div className={`avatar avatar--${user.id % 6}${large ? ' avatar--large' : ''}`} aria-hidden="true">
      {getInitials(user.name)}
    </div>
  );
}
