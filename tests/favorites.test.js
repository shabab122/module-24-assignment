import test from 'node:test';
import assert from 'node:assert/strict';
import { createFavoritesStore, FAVORITES_KEY } from '../src/store/favoritesStore.js';
import { filterUsers, getInitials, isUser } from '../src/utils/users.js';

const leanne = { id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz', phone: '1-770-736-8031', company: { name: 'Romaguera-Crona' } };
const ervin = { id: 2, name: 'Ervin Howell', email: 'Shanna@melissa.tv', phone: '010-692-6593' };

function memoryStorage(initialValue) {
  const data = new Map(initialValue === undefined ? [] : [[FAVORITES_KEY, initialValue]]);
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

test('adding favorites saves complete users and prevents duplicates', () => {
  const storage = memoryStorage();
  const store = createFavoritesStore(storage);
  store.getState().addFavorite(leanne);
  store.getState().addFavorite(leanne);
  assert.deepEqual(store.getState().favorites, [leanne]);
  assert.deepEqual(JSON.parse(storage.getItem(FAVORITES_KEY)), [leanne]);
});

test('a fresh store restores favorites after a simulated page refresh', () => {
  const storage = memoryStorage();
  createFavoritesStore(storage).getState().addFavorite(leanne);
  const refreshed = createFavoritesStore(storage);
  assert.deepEqual(refreshed.getState().favorites, [leanne]);
  assert.equal(refreshed.getState().storageError, '');
});

test('removing a favorite updates storage and keeps other users', () => {
  const storage = memoryStorage(JSON.stringify([leanne, ervin]));
  const store = createFavoritesStore(storage);
  store.getState().removeFavorite(1);
  assert.deepEqual(store.getState().favorites, [ervin]);
  assert.deepEqual(createFavoritesStore(storage).getState().favorites, [ervin]);
});

test('corrupt JSON and invalid saved records do not crash the app', () => {
  for (const value of ['broken json', '{}', '[null]', '[{"id":1}]']) {
    const store = createFavoritesStore(memoryStorage(value));
    assert.deepEqual(store.getState().favorites, []);
    assert.notEqual(store.getState().storageError, '');
  }
});

test('duplicate saved IDs are restored only once', () => {
  const store = createFavoritesStore(memoryStorage(JSON.stringify([leanne, leanne])));
  assert.equal(store.getState().favorites.length, 1);
});

test('blocked Local Storage keeps in-memory favorites working with a warning', () => {
  const blocked = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Quota exceeded'); } };
  const store = createFavoritesStore(blocked);
  store.getState().addFavorite(leanne);
  assert.deepEqual(store.getState().favorites, [leanne]);
  assert.match(store.getState().storageError, /could not save/);
  store.getState().removeFavorite(1);
  assert.deepEqual(store.getState().favorites, []);
});

test('invalid records cannot be added to favorites', () => {
  const store = createFavoritesStore(memoryStorage());
  store.getState().addFavorite({ id: 3 });
  store.getState().addFavorite(null);
  assert.deepEqual(store.getState().favorites, []);
});

test('search matches name, email, phone, and company without case sensitivity', () => {
  const users = [leanne, ervin];
  assert.deepEqual(filterUsers(users, ' LEANNE '), [leanne]);
  assert.deepEqual(filterUsers(users, 'MELISSA'), [ervin]);
  assert.deepEqual(filterUsers(users, '770'), [leanne]);
  assert.deepEqual(filterUsers(users, 'Romaguera'), [leanne]);
  assert.deepEqual(filterUsers(users, 'no match'), []);
  assert.deepEqual(filterUsers(users, ''), users);
});

test('user validation rejects values that could break the interface', () => {
  assert.equal(isUser(leanne), true);
  assert.equal(isUser({ ...leanne, id: '1' }), false);
  assert.equal(isUser({ ...leanne, name: '' }), false);
  assert.equal(isUser({ ...leanne, company: { name: {} } }), false);
  assert.equal(isUser({ ...leanne, address: { city: {} } }), false);
});

test('initials handle one word, multiple words, and extra spaces', () => {
  assert.equal(getInitials('Leanne Graham'), 'LG');
  assert.equal(getInitials('  Ervin  Howell '), 'EH');
  assert.equal(getInitials('Pogo'), 'P');
});
