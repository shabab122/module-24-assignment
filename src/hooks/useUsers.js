import { useEffect, useState } from 'react';
import { isUser } from '../utils/users.js';

const USERS_API = 'https://jsonplaceholder.typicode.com/users';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let timedOut = false;

    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);

    async function fetchUsers() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(USERS_API, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);

        const data = await response.json();
        if (!Array.isArray(data) || !data.every(isUser)) {
          throw new Error('The API returned unexpected user data');
        }

        if (active) setUsers(data);
      } catch (fetchError) {
        if (!active) return;
        if (timedOut) {
          setError('The request took too long. Please try again.');
        } else if (fetchError.name !== 'AbortError') {
          setError('We could not load users. Check your connection and try again.');
        }
      } finally {
        window.clearTimeout(timeout);
        if (active) setLoading(false);
      }
    }

    fetchUsers();

    // Cancel requests on unmount and during Strict Mode's development check.
    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  return { users, loading, error, retry: () => setAttempt((value) => value + 1) };
}
