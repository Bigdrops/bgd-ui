import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import 'highlight.js/styles/atom-one-dark.css'
import type { ComponentFile } from '@/lib/component-registry'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('typescriptreact', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('javascriptreact', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)

interface SourceFileListProps {
  files: ComponentFile[]
  getContent: (path: string) => string | undefined
  onCopyAll: () => void
  onCopyFile: (path: string) => void
}

interface SourceFileBlockProps {
  file: ComponentFile
  code: string
  onCopyFile: (path: string) => void
  defaultOpen?: boolean
}

function SourceFileBlock({ file, code, onCopyFile, defaultOpen = false }: SourceFileBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const filename = file.path.split('/').pop() ?? file.path

  useEffect(() => {
    if (codeRef.current && hljs.getLanguage(file.language)) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, file.language])

  const lines = code.split('\n')

  return (
    <details className="source-file-list__item" open={defaultOpen}>
      <summary className="source-file-list__summary">
        <div className="source-file-list__summary-meta">
          <span className="source-file-list__filename">{filename}</span>
          <span className="source-file-list__path">{file.path}</span>
        </div>
        <div className="source-file-list__summary-actions">
          <span className="source-file-list__lang">{file.language}</span>
          <button
            type="button"
            className="source-file-list__copy-btn"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onCopyFile(file.path)
            }}
          >
            Copy
          </button>
        </div>
      </summary>
      <div className="code-viewer__body source-file-list__body">
        <div className="code-viewer__gutter">
          {lines.map((_, index) => (
            <div key={index} className="code-viewer__line-num">
              {index + 1}
            </div>
          ))}
        </div>
        <pre className="code-viewer__pre">
          <code ref={codeRef} className={`language-${file.language}`}>
            {code}
          </code>
        </pre>
      </div>
    </details>
  )
}

function SourceFileList({ files, getContent, onCopyAll, onCopyFile }: SourceFileListProps) {
  return (
    <div className="source-file-list">
      <div className="source-file-list__toolbar">
        <span className="source-file-list__count">
          {files.length} file{files.length === 1 ? '' : 's'}
        </span>
        <button type="button" className="code-viewer__copy-btn" onClick={onCopyAll}>
          Copy All Files
        </button>
      </div>
      <div className="source-file-list__items">
        {files.map((file, index) => {
          const content = getContent(file.path)
          if (content === undefined) {
            return (
              <details className="source-file-list__item" key={file.path} open={index === 0}>
                <summary className="source-file-list__summary">
                  <div className="source-file-list__summary-meta">
                    <span className="source-file-list__filename">{file.path.split('/').pop() ?? file.path}</span>
                    <span className="source-file-list__path">{file.path}</span>
                  </div>
                  <div className="source-file-list__summary-actions">
                    <span className="source-file-list__lang">{file.language}</span>
                    <button
                      type="button"
                      className="source-file-list__copy-btn"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onCopyFile(file.path)
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </summary>
                <div className="source-file-list__missing">Source unavailable for this file.</div>
              </details>
            )
          }

          return (
            <SourceFileBlock
              key={file.path}
              file={file}
              code={content}
              onCopyFile={onCopyFile}
              defaultOpen={index === 0}
            />
          )
        })}
      </div>
    </div>
  )
}

export { SourceFileList }
