export default function CategoryTabs({ categories, activeCat, onSelect }) {
  return (
    <div className="cat-tabs">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`cat-tab ${activeCat === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
