import { useState, useRef } from 'react';

export default function ResumeUpload({ file, onFileChange }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      onFileChange(dropped);
    }
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileChange(selected);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono uppercase tracking-widest text-ink-400">
        01 — Resume PDF
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 p-8
          ${dragOver
            ? 'border-acid bg-acid/5 scale-[1.01]'
            : file
              ? 'border-acid/60 bg-acid/5'
              : 'border-ink-200 hover:border-ink-400 bg-ink-50/50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-acid/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-acid-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink-900 truncate">{file.name}</p>
              <p className="text-sm text-ink-400 font-mono mt-0.5">{formatSize(file.size)}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFileChange(null); }}
              className="w-8 h-8 rounded-full bg-ink-100 hover:bg-coral/20 hover:text-coral flex items-center justify-center text-ink-400 transition-colors"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="font-display font-semibold text-ink-900">
              {dragOver ? 'Drop it here!' : 'Drop your resume here'}
            </p>
            <p className="text-sm text-ink-400 mt-1">or click to browse — PDF only</p>
          </div>
        )}
      </div>
    </div>
  );
}
