import { useEffect, useRef, useState, useCallback } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import 'highlight.js/styles/atom-one-dark.css'
import type { ComponentFile } from '@/lib/component-registry'
import { copyToClipboard } from '@/lib/clipboard'

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
}

interface SourceFileBlockProps {
  file: ComponentFile
  code: string
  getContent: (path: string) => string | undefined
  defaultOpen?: boolean
}

function SourceFileBlock({ file, code, getContent, defaultOpen = false }: SourceFileBlockProps) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)
  const filename = file.path.split('/').pop() ?? file.path

  useEffect(() => {
    if (codeRef.current && hljs.getLanguage(file.language)) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, file.language])

  const lines = code.split('\n')

  const handleCopy = useCallback(async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const content = getContent(file.path)
    if (content !== undefined) {
      const ok = await copyToClipboard(content)
      if (ok) {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }, [file.path, getContent])

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
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
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

function SourceFileList({ files, getContent }: SourceFileListProps) {
  const [allCopied, setAllCopied] = useState(false)

  const handleCopyAll = useCallback(async () => {
    const parts: string[] = []
    for (const file of files) {
      const content = getContent(file.path)
      if (content !== undefined) {
        parts.push(`// ${file.path}`)
        parts.push(content)
        parts.push('')
      }
    }
    const text = parts.join('\n').trim()
    const ok = await copyToClipboard(text)
    if (ok) {
      setAllCopied(true)
      setTimeout(() => setAllCopied(false), 2000)
    }
  }, [files, getContent])

  return (
    <div className="source-file-list">
      <div className="source-file-list__toolbar">
        <span className="source-file-list__count">
          {files.length} file{files.length === 1 ? '' : 's'}
        </span>
        <button type="button" className="code-viewer__copy-btn" onClick={handleCopyAll}>
          {allCopied ? 'Copied' : 'Copy All'}
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
                    <span className="source-file-list__copy-btn" style={{ opacity: 0.4, cursor: 'default' }}>
                      N/A
                    </span>
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
              getContent={getContent}
              defaultOpen={index === 0}
            />
          )
        })}
      </div>
    </div>
  )
}

export { SourceFileList }
