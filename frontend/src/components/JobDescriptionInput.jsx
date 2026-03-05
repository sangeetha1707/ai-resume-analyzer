export default function JobDescriptionInput({ value, onChange }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono uppercase tracking-widest text-ink-400">
        02 — Job Description
      </label>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications for best results…"
          rows={9}
          className="
            w-full rounded-2xl border-2 border-ink-200 bg-ink-50/50 px-5 py-4
            font-body text-sm text-ink-900 placeholder-ink-300
            focus:outline-none focus:border-acid focus:bg-white
            resize-none transition-all duration-200 leading-relaxed
          "
        />
        <div className="absolute bottom-3 right-4 flex gap-3 text-xs font-mono text-ink-300">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {value.length > 0 && value.length < 50 && (
        <p className="text-xs text-coral flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          Please add a more complete job description (at least 50 characters)
        </p>
      )}
    </div>
  );
}
