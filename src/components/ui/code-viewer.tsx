import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('typescriptreact', typescript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('javascriptreact', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)

interface CodeViewerProps {
  code: string
  language: string
  filename: string
}

function CodeViewer({ code, filename, language }: CodeViewerProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current && hljs.getLanguage(language)) {
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  const lines = code.split('\n')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
  }

  return (
    <div className="code-viewer">
      <div className="code-viewer__header">
        <div className="code-viewer__meta">
          <span className="code-viewer__filename">{filename}</span>
          <span className="code-viewer__lang">{language}</span>
        </div>
        <button className="code-viewer__copy-btn" onClick={handleCopy}>
          Copy File
        </button>
      </div>
      <div className="code-viewer__body">
        <div className="code-viewer__gutter">
          {lines.map((_, i) => (
            <div key={i} className="code-viewer__line-num">{i + 1}</div>
          ))}
        </div>
        <pre className="code-viewer__pre">
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  )
}

export { CodeViewer }
