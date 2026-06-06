const CATCHES_KEY = 'fishinapp_catches'
const USER_KEY = 'fishinapp_user'
const USERS_KEY = 'fishinapp_users'

export function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') }
  catch { return [] }
}

export function saveUser(user) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === user.id)
  if (idx >= 0) users[idx] = user
  else users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') }
  catch { return null }
}

export function setCurrentUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  else localStorage.removeItem(USER_KEY)
}

export function getCatches(userId) {
  try {
    const all = JSON.parse(localStorage.getItem(CATCHES_KEY) || '[]')
    return userId ? all.filter(c => c.userId === userId) : all
  } catch { return [] }
}

export function saveCatch(catchData) {
  const { photos: _photos, ...rest } = catchData
  const all = JSON.parse(localStorage.getItem(CATCHES_KEY) || '[]')
  const idx = all.findIndex(c => c.id === rest.id)
  if (idx >= 0) all[idx] = rest
  else all.push(rest)
  localStorage.setItem(CATCHES_KEY, JSON.stringify(all))
  return catchData
}

export function deleteCatch(catchId) {
  const all = JSON.parse(localStorage.getItem(CATCHES_KEY) || '[]').filter(c => c.id !== catchId)
  localStorage.setItem(CATCHES_KEY, JSON.stringify(all))
}
