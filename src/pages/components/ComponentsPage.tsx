import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { COMPONENT_REGISTRY, getComponentById } from '@/lib/component-registry'
import { ComponentDetail } from '@/components/component-detail'
import './styles.css'

const CATEGORIES = ['All', ...Array.from(new Set(COMPONENT_REGISTRY.map((c) => c.category)))]

export function ComponentsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)

  const selectedComponent = selectedComponentId ? getComponentById(selectedComponentId) : null

  const filtered = useMemo(() => {
    return COMPONENT_REGISTRY.filter((comp) => {
      const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) ||
        comp.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || comp.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  if (selectedComponent) {
    return (
      <div className="components-page">
        <ComponentDetail
          component={selectedComponent}
          onBack={() => {
            setSelectedComponentId(null)
            setSearch('')
          }}
        />
      </div>
    )
  }

  return (
    <div className="components-page">
      <div className="components-page__header">
        <h1 className="components-page__title">Components</h1>
        <p className="components-page__subtitle">
          Beautifully designed, accessible, and production-ready UI components.
        </p>
      </div>

      <div className="components-page__controls">
        <div className="components-page__search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="components-page__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`components-page__filter ${activeCategory === cat ? 'components-page__filter--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="components-page__grid">
        {filtered.map((comp) => {
          const Icon = comp.icon
          return (
            <button
              key={comp.id}
              className="component-card"
              onClick={() => setSelectedComponentId(comp.id)}
            >
              <div className="component-card__preview">
                <Icon size={32} />
              </div>
              <div className="component-card__content">
                <div className="component-card__header">
                  <h3 className="component-card__name">{comp.name}</h3>
                  {comp.badge && (
                    <span className="component-card__badge">{comp.badge}</span>
                  )}
                </div>
                <p className="component-card__desc">{comp.description}</p>
                <span className="component-card__category">{comp.category}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
