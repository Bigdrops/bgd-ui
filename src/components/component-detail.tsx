import { useState, Suspense, useMemo, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { ComponentMeta } from '@/lib/component-registry'
import { getRawFileContent } from '@/lib/component-registry'
import { FileExplorer } from '@/components/ui/file-explorer'
import { CodeViewer } from '@/components/ui/code-viewer'
import { MarkdownViewer } from '@/components/ui/markdown-viewer'

type Tab = 'preview' | 'code' | 'design'

interface ComponentDetailProps {
  component: ComponentMeta
  onBack: () => void
}

function ComponentDetail({ component, onBack }: ComponentDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>('preview')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const hasSourceFiles = component.files.length > 0
  const hasDesignFiles = component.designFiles.length > 0
  const LazyComp = component.lazyComponent

  const initialSelectedFile = useMemo(() => {
    if (selectedFile) return selectedFile
    return component.files.length > 0 ? component.files[0].path : null
  }, [component.files, selectedFile])

  const selectedFileContent = useMemo(() => {
    if (!initialSelectedFile) return null
    return getRawFileContent(initialSelectedFile) ?? null
  }, [initialSelectedFile])

  const selectedFileMeta = useMemo(() => {
    if (!initialSelectedFile) return null
    return component.files.find((f) => f.path === initialSelectedFile) ?? null
  }, [component.files, initialSelectedFile])

  const handleCopyAll = useCallback(async () => {
    const parts: string[] = []
    for (const file of component.files) {
      const content = getRawFileContent(file.path)
      if (content !== undefined) {
        parts.push('========================================')
        parts.push(file.path)
        parts.push('')
        parts.push(content)
      }
    }
    await navigator.clipboard.writeText(parts.join('\n'))
  }, [component.files])

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
              <>
                <FileExplorer
                  files={component.files}
                  componentName={component.name}
                  selectedPath={initialSelectedFile}
                  onSelectFile={setSelectedFile}
                />
                <div className="component-detail__code-main">
                  <div className="component-detail__code-toolbar">
                    {component.files.length > 1 && (
                      <button className="code-viewer__copy-btn" onClick={handleCopyAll}>
                        Copy All Files
                      </button>
                    )}
                  </div>
                  {selectedFileContent !== null && selectedFileMeta ? (
                    <CodeViewer
                      code={selectedFileContent}
                      filename={selectedFileMeta.path.split('/').pop() ?? selectedFileMeta.path}
                      language={selectedFileMeta.language}
                    />
                  ) : (
                    <div className="component-detail__empty">
                      <p>Select a file to view its source code.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'design' && (
          <div className="component-detail__design">
            {!hasDesignFiles ? (
              <div className="component-detail__empty">
                <p>No design document found for this component.</p>
              </div>
            ) : (
              component.designFiles.map((df) => {
                const content = getRawFileContent(df.path) ?? ''
                return (
                  <MarkdownViewer
                    key={df.path}
                    content={content}
                    filename={df.path.split('/').pop() ?? df.path}
                  />
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { ComponentDetail }
