import type { ComponentFile } from '@/lib/component-registry'

interface FileExplorerProps {
  files: ComponentFile[]
  componentName: string
  selectedPath: string | null
  onSelectFile: (path: string) => void
  onCopyFile: (path: string) => void
}

function FileExplorer({ files, componentName, selectedPath, onSelectFile, onCopyFile }: FileExplorerProps) {
  const directories = new Map<string, ComponentFile[]>()

  for (const file of files) {
    const parts = file.path.split('/')
    const dir = parts.length > 1 ? parts.slice(0, -1).join('/') : '.'
    if (!directories.has(dir)) directories.set(dir, [])
    directories.get(dir)!.push(file)
  }

  return (
    <div className="file-explorer">
      <div className="file-explorer__header">
        <span className="file-explorer__title">{componentName}</span>
        <span className="file-explorer__count">{files.length} {files.length === 1 ? 'file' : 'files'}</span>
      </div>
      <div className="file-explorer__tree">
        {Array.from(directories.entries()).map(([dir, dirFiles]) => (
          <div key={dir}>
            {dir !== '.' && (
              <div className="file-explorer__dir">
                <span className="file-explorer__dir-icon">&#9660;</span>
                {dir}/
              </div>
            )}
            <div className="file-explorer__files">
              {dirFiles.map((file) => (
                <div
                  key={file.path}
                  className={`file-explorer__file ${selectedPath === file.path ? 'file-explorer__file--active' : ''}`}
                >
                  <button
                    type="button"
                    className="file-explorer__file-main"
                    onClick={() => onSelectFile(file.path)}
                  >
                    <span className="file-explorer__file-icon">
                      {file.language === 'typescriptreact' || file.language === 'typescript'
                        ? 'T'
                        : file.language === 'css'
                          ? '#'
                          : 'F'}
                    </span>
                    <span className="file-explorer__file-name">{file.path.split('/').pop()}</span>
                  </button>
                  <button
                    type="button"
                    className="file-explorer__file-copy"
                    onClick={() => onCopyFile(file.path)}
                    aria-label={`Copy ${file.path.split('/').pop() ?? file.path}`}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { FileExplorer }
