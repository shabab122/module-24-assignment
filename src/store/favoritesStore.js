import { create } from 'zustand';
import { isUser } from '../utils/users.js';

export const FAVORITES_KEY = 'module24-favorite-users';

function readFavorites(storage) {
  try {
    const saved = (storage ?? window.localStorage).getItem(FAVORITES_KEY);
    if (!saved) return { favorites: [], storageError: '' };

    const users = JSON.parse(saved);
    if (!Array.isArray(users) || !users.every(isUser)) {
      throw new Error('Invalid saved favorites');
    }

    // Keep only one copy of each user if saved data contains duplicates.
    const favorites = [...new Map(users.map((user) => [user.id, user])).values()];
    return { favorites, storageError: '' };
  } catch {
    return {
      favorites: [],
      storageError: 'Saved favorites could not be loaded. You can still browse and add favorites.',
    };
  }
}

// The optional storage argument lets tests use in-memory storage.
export function createFavoritesStore(storage) {
  return create((set, get) => {
    function updateFavorites(favorites) {
      let storageError = '';

      try {
        (storage ?? window.localStorage).setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch {
        storageError = 'Favorites work for this visit, but this browser could not save them for next time.';
      }

      set({ favorites, storageError });
    }

    return {
      ...readFavorites(storage),

      addFavorite: (user) => {
        if (!isUser(user) || get().favorites.some((favorite) => favorite.id === user.id)) return;
        updateFavorites([...get().favorites, user]);
      },

      removeFavorite: (userId) => {
        updateFavorites(get().favorites.filter((user) => user.id !== userId));
      },
    };
  });
}

// Restore saved users once when this module is loaded.
export const useFavoritesStore = createFavoritesStore();
