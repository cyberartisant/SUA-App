const DB_NAME = 'fishinapp'
const STORE = 'photos'
const VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE)
    req.onsuccess = e => resolve(e.target.result)
    req.onerror = e => reject(e.target.error)
  })
}

export async function savePhotos(catchId, photos) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(photos, catchId)
    tx.oncomplete = () => resolve()
    tx.onerror = e => reject(e.target.error)
  })
}

export async function getPhotos(catchId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(catchId)
    req.onsuccess = e => resolve(e.target.result || [])
    req.onerror = e => reject(e.target.error)
  })
}

export async function getAllPhotos(catchIds) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const results = {}
    let pending = catchIds.length
    if (!pending) { resolve(results); return }
    catchIds.forEach(id => {
      const req = store.get(id)
      req.onsuccess = e => {
        results[id] = e.target.result || []
        if (--pending === 0) resolve(results)
      }
      req.onerror = e => reject(e.target.error)
    })
  })
}

export async function deletePhotos(catchId) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(catchId)
    tx.oncomplete = () => resolve()
    tx.onerror = e => reject(e.target.error)
  })
}
