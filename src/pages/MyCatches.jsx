import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatches } from '../contexts/CatchContext'
import CatchCard from '../components/CatchCard'

export default function MyCatches() {
  const { catches } = useCatches()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filtered = catches
    .filter(c =>
      c.species.toLowerCase().includes(search.toLowerCase()) ||
      (c.notes || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortBy === 'heaviest') return (b.weight || 0) - (a.weight || 0)
      if (sortBy === 'longest') return (b.length || 0) - (a.length || 0)
      return 0
    })

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Catches</h1>
        <Link to="/add" className="btn-primary-sm">+ Add</Link>
      </div>

      <div className="filter-bar">
        <input
          type="search"
          placeholder="Search species, notes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="heaviest">Heaviest</option>
          <option value="longest">Longest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          {catches.length === 0 ? (
            <>
              <div className="empty-icon">🐟</div>
              <p>No catches logged yet!</p>
              <Link to="/add" className="btn-primary">Log Your First Catch</Link>
            </>
          ) : (
            <p>No catches match your search.</p>
          )}
        </div>
      ) : (
        <div className="catch-list">
          {filtered.map(c => <CatchCard key={c.id} catch={c} />)}
        </div>
      )}
    </div>
  )
}
