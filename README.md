# People — User Management App

A simple, responsive React app for the Module 24 assignment: API calling with `useEffect`, user details with React state, and favorite users managed with Zustand and saved in Local Storage.

## Submission links

| Item | Link / status |
| --- | --- |
| Public GitHub repository | Pending: add the actual public repository URL after uploading. |
| Live project on Vercel | Pending: add the actual production deployment URL after deploying. |

**Before submission:** replace both pending entries above with your real links. No deployment URL is claimed in this starter README.

## Features

- Fetch users from `https://jsonplaceholder.typicode.com/users` when the app mounts using `useEffect`.
- Show each user's name, email, phone, username, and company in a responsive card grid.
- Show a loading message during requests and a retry button on errors.
- Open an accessible Details modal with React's `useState`.
- Add and remove favorites through separate Zustand store actions.
- Save complete favorite user records to Local Storage immediately after changes.
- Restore favorites on app startup, including when the API is unavailable.
- Display total users and favorite count in the navbar.
- Search by name, email, phone, or company.
- Show useful empty states, keyboard focus indicators, and storage warnings.

## Technology

React, Vite, Zustand, the browser Fetch API, Local Storage, and normal CSS. No backend, account, database, or API key is needed.

## Run locally

Install Node.js **24 LTS** (or Node 22.12+) and npm first.

1. Extract this project and open a terminal inside the `module-24-user-management` folder.
2. Install the exact locked dependencies:

   ```bash
   npm ci
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite, normally `http://localhost:5173`.

These commands work in Linux, macOS, and Windows terminals. Do not open `index.html` directly; use Vite.

## Other commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run automated favorites, persistence, validation, and search tests. |
| `npm run build` | Produce the production app in `dist/`. |
| `npm run preview` | Preview a production build locally. Run the build first. |

## Project files

| File | Responsibility |
| --- | --- |
| `src/App.jsx` | Page layout, search, current view, and selected user's React state. |
| `src/hooks/useUsers.js` | `useEffect`, fetch, loading/error states, timeout, cleanup, and retry. |
| `src/store/favoritesStore.js` | Zustand favorites, add/remove actions, and Local Storage reads/writes. |
| `src/components/Navbar.jsx` | Directory navigation, total user count, and favorite count. |
| `src/components/UserCard.jsx` | User card with Details and Favorite buttons. |
| `src/components/UserDetails.jsx` | Native dialog for selected user information. |
| `src/components/FavoriteButton.jsx` | Shared Favorite toggle button. |
| `src/utils/users.js` | User validation, initials, and search helpers. |
| `src/styles.css` | Desktop, tablet, and mobile styles. |
| `tests/favorites.test.js` | Automated behavior and persistence checks. |
| `vercel.json` | Vite build and output settings for Vercel. |

## How the assignment concepts work

### 1. API calling and useEffect

`useUsers()` calls the users API inside `useEffect`. The effect runs when the component loads; it runs again only when Retry changes the `attempt` state. While the request runs, `loading` is true. The hook checks HTTP errors and validates the response before updating the users state. Cleanup cancels an unfinished request with `AbortController`.

React Strict Mode can start and clean up an extra request in development. The cleanup handles this; an aborted development request is expected.

### 2. User details with React state

Clicking Details calls `setSelectedUser(user)`. A non-null selected user renders `UserDetails`. Closing the dialog, clicking its backdrop, or pressing Escape sets the selection back to `null`. The native dialog manages keyboard focus while it is open.

### 3. Zustand and Local Storage

`useFavoritesStore` holds the shared `favorites` array. `addFavorite(user)` prevents duplicate IDs. `removeFavorite(userId)` removes the matching user. Both actions update the store and write the new array with `JSON.stringify()`.

At startup, `readFavorites()` reads `module24-favorite-users` from Local Storage and uses `JSON.parse()` to restore the array. Complete user objects are stored, so saved favorites remain visible if the API cannot load. The app handles invalid JSON and blocked storage without crashing.

Local Storage belongs to the current browser and website origin. Favorites do not sync between devices or between localhost and the Vercel deployment. Clearing site data removes saved favorites.

## Upload to a public GitHub repository

1. Sign in to [GitHub](https://github.com/new) and create an empty repository named `module-24-user-management`.
2. Choose **Public**. Because the source already includes a README, leave GitHub's initial README, license, and .gitignore options unchecked.
3. From the project folder, run these commands **one at a time**. If Git already tracks this folder, check `git status` first and use its existing branch and remote rather than reinitializing it.

   ```bash
   git init -b main
   ```

   ```bash
   git add .
   ```

   ```bash
   git commit -m "feat: complete Module 24 user management assignment"
   ```

4. Replace `YOUR_USERNAME` with your GitHub username:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/module-24-user-management.git
   ```

5. Upload the main branch:

   ```bash
   git push -u origin main
   ```

`.gitignore` excludes installed dependencies, build files, local environment files, and Vercel metadata. The first commit establishes this new repository; use feature branches and pull requests for later changes.

## Deploy on Vercel

1. Sign in at [Vercel](https://vercel.com/new), choose **Add New → Project**, and import your public GitHub repository.
2. Use these project settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Vite |
   | Root directory | The folder containing `package.json`; normally `./` when these files are at the repository root. |
   | Install command | `npm ci` |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Node.js version | 24.x |
   | Environment variables | None |

3. Click **Deploy** and copy the actual production URL once deployment succeeds.
4. Replace the two pending entries at the top of this README with your public repository URL and the actual Vercel URL. Commit and push that README update.
5. Check the GitHub repository and the live app in a signed-out/private browser window, then submit the README link required by your course.

`vercel.json` includes the build settings. This app uses a single root page and needs no route rewrite.

## Manual verification

Verified during development: production build passed; all 10 automated tests passed; the live API returned 10 users; Details, add/remove favorites, refresh persistence, search, and empty states were checked in the browser. The responsive layout was also checked at effective CSS viewport widths of 545px and 340px using browser zoom, with no horizontal overflow. This is not a physical-device test.

1. On load, observe the loading message, then check that cards show API user names, emails, and phone numbers.
2. Open Details and verify the selected person's contact, company, website, and address. Close with the close button, Escape, and backdrop.
3. Add two favorites. Check the navbar count and Favorites view.
4. Refresh the page. Check that the same two favorites remain.
5. Remove one favorite, refresh again, and confirm it stays removed.
6. Search for a user, search for a nonexistent name, and clear the search.
7. Check the layout on a phone-sized screen and a desktop screen.
8. Disable the network and reload. Check the API error and that saved Favorites still work; reconnect and click Try again.

## Notes

- JSONPlaceholder provides sample user records, not real accounts managed by this app.
- Internet access is needed to load the user API. Saved favorites can still be viewed if that API request fails after the app itself loads.
- If browser storage is blocked or full, favorites work in memory and the app explains that they may not survive a refresh.
- The optional Google Fonts import falls back to system fonts if unavailable.

## References

- [React: useEffect](https://react.dev/reference/react/useEffect)
- [Zustand: introduction](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)
- [JSONPlaceholder users API](https://jsonplaceholder.typicode.com/users)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)
