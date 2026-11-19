// Validate data from both the API and Local Storage before rendering it.
export function isUser(user) {
  return (
    user !== null &&
    typeof user === 'object' &&
    Number.isInteger(user.id) &&
    user.id > 0 &&
    ['name', 'email', 'phone'].every(
      (key) => typeof user[key] === 'string' && user[key].trim().length > 0,
    ) &&
    ['username', 'website'].every(
      (key) => user[key] === undefined || typeof user[key] === 'string',
    ) &&
    ['street', 'suite', 'city', 'zipcode'].every(
      (key) => user.address?.[key] === undefined || typeof user.address[key] === 'string',
    ) &&
    ['name', 'catchPhrase', 'bs'].every(
      (key) => user.company?.[key] === undefined || typeof user.company[key] === 'string',
    )
  );
}

export function getInitials(name) {
  const words = name.trim().split(/\s+/);
  return `${words[0]?.[0] ?? ''}${words.length > 1 ? words.at(-1)[0] : ''}`.toUpperCase();
}

export function filterUsers(users, query) {
  const search = query.trim().toLowerCase();
  return users.filter((user) =>
    [user.name, user.email, user.phone, user.company?.name ?? '']
      .some((value) => value.toLowerCase().includes(search)),
  );
}
