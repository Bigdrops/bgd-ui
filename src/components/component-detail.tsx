import { useState, Suspense, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { ComponentMeta } from '@/lib/component-registry'
import { getRawFileContent } from '@/lib/component-registry'
import { MarkdownViewer } from '@/components/ui/markdown-viewer'
import { SourceFileList } from '@/components/ui/source-file-list'

type Tab = 'preview' | 'code' | 'design'

interface ComponentDetailProps {
  component: ComponentMeta
  onBack: () => void
}

function ComponentDetail({ component, onBack }: ComponentDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview')

  const hasSourceFiles = component.files.length > 0
  const hasDesignFile = component.designFile !== null
  const LazyComp = component.previewComponent

  const copyText = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
  }, [])

  const copyFileByPath = useCallback(async (path: string) => {
    const content = getRawFileContent(path)
    if (content !== undefined) {
      await copyText(content)
    }
  }, [copyText])

  const handleCopyAll = useCallback(async () => {
    const parts: string[] = []
    for (const file of component.files) {
      const content = getRawFileContent(file.path)
      if (content !== undefined) {
        parts.push(`// ${file.path}`)
        parts.push(content)
        parts.push('')
      }
    }
    await copyText(parts.join('\n').trim())
  }, [component.files, copyText])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'design', label: 'Design.md' },
  ]

  const Icon = component.icon

  return (
    <div className="component-detail">
      <div className="component-detail__topbar">
        <button className="component-detail__back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="component-detail__identity">
          <Icon size={20} />
          <h2 className="component-detail__name">{component.name}</h2>
          <span className="component-detail__category">{component.category}</span>
        </div>
      </div>

      <div className="component-detail__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`component-detail__tab ${activeTab === tab.id ? 'component-detail__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="component-detail__content">
        {activeTab === 'preview' && (
          <div className="component-detail__preview">
            {LazyComp ? (
              <Suspense
                fallback={
                  <div className="component-detail__loading">
                    <span>Loading component...</span>
                  </div>
                }
              >
                <LazyComp />
              </Suspense>
            ) : (
              <div className="component-detail__placeholder">
                <Icon size={48} />
                <p>{component.description}</p>
                <span className="component-detail__placeholder-badge">Preview not available</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="component-detail__code">
            {!hasSourceFiles ? (
              <div className="component-detail__empty">
                <p>No source files registered for this component.</p>
              </div>
            ) : (
              <SourceFileList
                files={component.files}
                getContent={getRawFileContent}
                onCopyAll={handleCopyAll}
                onCopyFile={copyFileByPath}
              />
            )}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="component-detail__design">
            {!hasDesignFile ? (
              <div className="component-detail__empty">
                <p>No design.md available for this component.</p>
              </div>
            ) : (
              <MarkdownViewer
                content={getRawFileContent(component.designFile!) ?? ''}
                filename={component.designFile!.split('/').pop() ?? component.designFile!}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { ComponentDetail }
