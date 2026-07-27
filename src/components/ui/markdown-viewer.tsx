import { useMemo, useState, useCallback } from 'react'
import { copyToClipboard } from '@/lib/clipboard'

interface MarkdownViewerProps {
  content: string
  filename: string
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const html: string[] = []
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let inList: false | 'ul' | 'ol' = false

  function closeList() {
    if (inList) {
      html.push('</' + inList + '>')
      inList = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('```')) {
      closeList()
      if (inCodeBlock) {
        html.push('<pre><code>' + escapeHtml(codeBuffer.join('\n')) + '</code></pre>')
        codeBuffer = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    const trimmed = line.trim()

    if (trimmed === '') {
      closeList()
      continue
    }

    if (trimmed.startsWith('# ')) {
      closeList()
      html.push('<h1>' + parseInline(trimmed.slice(2)) + '</h1>')
    } else if (trimmed.startsWith('## ')) {
      closeList()
      html.push('<h2>' + parseInline(trimmed.slice(3)) + '</h2>')
    } else if (trimmed.startsWith('### ')) {
      closeList()
      html.push('<h3>' + parseInline(trimmed.slice(4)) + '</h3>')
    } else if (trimmed.startsWith('#### ')) {
      closeList()
      html.push('<h4>' + parseInline(trimmed.slice(5)) + '</h4>')
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        inList = 'ul'
        html.push('<ul>')
      }
      html.push('<li>' + parseInline(trimmed.slice(2)) + '</li>')
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        inList = 'ol'
        html.push('<ol>')
      }
      html.push('<li>' + parseInline(trimmed.replace(/^\d+\.\s/, '')) + '</li>')
    } else if (trimmed.startsWith('> ')) {
      closeList()
      html.push('<blockquote><p>' + parseInline(trimmed.slice(2)) + '</p></blockquote>')
    } else if (/^#{1,6}\s/.test(trimmed)) {
      closeList()
      const level = trimmed.match(/^#{1,6}/)![0].length
      html.push('<h' + level + '>' + parseInline(trimmed.slice(level + 1)) + '</h' + level + '>')
    } else {
      closeList()
      html.push('<p>' + parseInline(trimmed) + '</p>')
    }
  }

  closeList()

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
  const rendered = useMemo(() => renderMarkdown(content), [content])
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const ok = await copyToClipboard(content)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [content])

  return (
    <div className="markdown-viewer">
      <div className="markdown-viewer__header">
        <span className="markdown-viewer__filename">{filename}</span>
        {content && (
          <button
            type="button"
            className="markdown-viewer__copy-btn"
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      <div className="markdown-viewer__body">
        {!content && (
          <div className="markdown-viewer__empty">
            No design.md available for this component.
          </div>
        )}
        {content && (
          <div className="markdown-viewer__rendered" dangerouslySetInnerHTML={{ __html: rendered }} />
        )}
      </div>
    </div>
  )
}

export { MarkdownViewer }
