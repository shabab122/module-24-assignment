import Icon from './Icon.jsx';

export default function FavoriteButton({ user, isFavorite, onToggle }) {
  return (
    <button
      type="button"
      className={`button favorite-button${isFavorite ? ' is-favorite' : ''}`}
      aria-pressed={isFavorite}
      aria-label={`${isFavorite ? 'Remove' : 'Add'} ${user.name} ${isFavorite ? 'from' : 'to'} favorites`}
      onClick={() => onToggle(user)}
    >
      <Icon name="heart" size={17} filled={isFavorite} />
      {isFavorite ? 'Favorited' : 'Favorite'}
    </button>
  );
}
