import { useState } from 'react'
import { Search, Square, LayoutGrid, Table, Type, ChevronDown, MessageSquare, BarChart, ArrowRight, Filter, LayoutDashboard } from 'lucide-react'
import './styles.css'

const CATEGORIES = ['All', 'Layout', 'Forms', 'Data Display', 'Feedback', 'Navigation', 'Dashboard']

const COMPONENTS = [
  { name: 'Button', category: 'Forms', description: 'Interactive button with multiple variants and sizes.', badge: 'New', icon: Square },
  { name: 'Card', category: 'Layout', description: 'Container for grouping related content.', badge: null, icon: LayoutGrid },
  { name: 'Table', category: 'Data Display', description: 'Data table with sorting, filtering, and pagination.', badge: null, icon: Table },
  { name: 'Input', category: 'Forms', description: 'Text input field with validation states.', badge: null, icon: Type },
  { name: 'Select', category: 'Forms', description: 'Dropdown select with search and multi-select.', badge: null, icon: ChevronDown },
  { name: 'Dialog', category: 'Feedback', description: 'Modal dialog for confirmations and forms.', badge: null, icon: MessageSquare },
  { name: 'Chart', category: 'Data Display', description: 'Data visualization with multiple chart types.', badge: 'New', icon: BarChart },
  { name: 'Badge', category: 'Data Display', description: 'Status indicator and label component.', badge: null, icon: Square },
  { name: 'Alert', category: 'Feedback', description: 'Inline notification with severity levels.', badge: null, icon: MessageSquare },
  { name: 'Tabs', category: 'Navigation', description: 'Tabbed navigation for switching views.', badge: null, icon: LayoutGrid },
  { name: 'Sidebar', category: 'Navigation', description: 'Collapsible sidebar navigation.', badge: null, icon: LayoutGrid },
  { name: 'Form', category: 'Forms', description: 'Form layout with validation and error handling.', badge: null, icon: Type },
  { name: 'Infinite Notification Carousel', category: 'Dashboard', description: 'Production-ready infinite carousel with autoplay, touch swipe, and pagination dots.', badge: null, icon: LayoutDashboard },
  { name: 'Modern Web Intelligence Dashboard', category: 'Dashboard', description: 'Real-time financial snapshot, telemetry stream, activity feed, and document management.', badge: 'New', icon: LayoutDashboard },
]

export function ComponentsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = COMPONENTS.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || comp.category === activeCategory
    return matchesSearch && matchesCategory
  })

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
            <a key={comp.name} href="#" className="component-card">
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
            </a>
          )
        })}
      </div>
    </div>
  )
}
