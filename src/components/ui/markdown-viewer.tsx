import { useMemo, useState } from 'react'

interface MarkdownViewerProps {
  content: string
  filename: string
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let codeLang = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html.push('<pre><code>' + escapeHtml(codeBuffer.join('\n')) + '</code></pre>')
        codeBuffer = []
        inCodeBlock = false
        codeLang = ''
      } else {
        inCodeBlock = true
        codeLang = line.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    const trimmed = line.trim()

    if (trimmed === '') {
      html.push('<p></p>')
      continue
    }

    if (trimmed.startsWith('# ')) {
      html.push('<h1>' + parseInline(trimmed.slice(2)) + '</h1>')
    } else if (trimmed.startsWith('## ')) {
      html.push('<h2>' + parseInline(trimmed.slice(3)) + '</h2>')
    } else if (trimmed.startsWith('### ')) {
      html.push('<h3>' + parseInline(trimmed.slice(4)) + '</h3>')
    } else if (trimmed.startsWith('#### ')) {
      html.push('<h4>' + parseInline(trimmed.slice(5)) + '</h4>')
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      html.push('<li>' + parseInline(trimmed.slice(2)) + '</li>')
    } else if (/^\d+\.\s/.test(trimmed)) {
      html.push('<li>' + parseInline(trimmed.replace(/^\d+\.\s/, '')) + '</li>')
    } else {
      html.push('<p>' + parseInline(trimmed) + '</p>')
    }
  }

  return html.join('\n')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function parseInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

function MarkdownViewer({ content, filename }: MarkdownViewerProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered')

  const rendered = useMemo(() => renderMarkdown(content), [content])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
  }

  return (
    <div className="markdown-viewer">
      <div className="markdown-viewer__header">
        <span className="markdown-viewer__filename">{filename}</span>
        <div className="markdown-viewer__actions">
          <div className="markdown-viewer__toggles">
            <button
              className={`markdown-viewer__toggle ${viewMode === 'rendered' ? 'markdown-viewer__toggle--active' : ''}`}
              onClick={() => setViewMode('rendered')}
            >
              Preview
            </button>
            <button
              className={`markdown-viewer__toggle ${viewMode === 'raw' ? 'markdown-viewer__toggle--active' : ''}`}
              onClick={() => setViewMode('raw')}
            >
              Raw
            </button>
          </div>
          <button className="code-viewer__copy-btn" onClick={handleCopy}>
            Copy File
          </button>
        </div>
      </div>
      <div className="markdown-viewer__body">
        {viewMode === 'rendered' ? (
          <div className="markdown-viewer__rendered" dangerouslySetInnerHTML={{ __html: rendered }} />
        ) : (
          <pre className="markdown-viewer__raw"><code>{content}</code></pre>
        )}
        {!content && (
          <div className="markdown-viewer__empty">
            No design document found for this component.
          </div>
        )}
      </div>
    </div>
  )
}

export { MarkdownViewer }
