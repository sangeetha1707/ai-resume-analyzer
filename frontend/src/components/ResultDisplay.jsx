import { useEffect, useState } from 'react';

function ScoreRing({ score }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return '#c8f135';
    if (s >= 50) return '#4fd1ff';
    if (s >= 30) return '#ff9f47';
    return '#ff6b47';
  };

  const getLabel = (s) => {
    if (s >= 75) return { text: 'Strong Match', cls: 'text-acid-dark' };
    if (s >= 50) return { text: 'Good Match', cls: 'text-sky' };
    if (s >= 30) return { text: 'Partial Match', cls: 'text-orange-400' };
    return { text: 'Low Match', cls: 'text-coral' };
  };

  const label = getLabel(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e8e3d8" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none"
            stroke={getColor(score)} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-3xl text-ink-900 leading-none">
            {Math.round(score)}
          </span>
          <span className="font-mono text-xs text-ink-400">%</span>
        </div>
      </div>
      <span className={`mt-2 font-display font-semibold text-sm ${label.cls}`}>
        {label.text}
      </span>
    </div>
  );
}

function SkillPill({ skill, variant }) {
  const styles = {
    matched: 'bg-acid/20 text-acid-dark border border-acid/40',
    missing: 'bg-coral/10 text-coral border border-coral/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-medium ${styles[variant]}`}>
      {variant === 'matched'
        ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
        : <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
      }
      {skill}
    </span>
  );
}

export default function ResultDisplay({ result }) {
  const { matchScore, matchedSkills, missingSkills, suggestions, resumeWordCount, filename, totalJobSkills } = result;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-0.5 bg-acid"></div>
        <span className="font-mono text-xs uppercase tracking-widest text-ink-400">Analysis Complete</span>
      </div>

      {/* Score + Stats */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={matchScore} />
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { label: 'Skills Matched', value: matchedSkills.length, color: 'text-acid-dark' },
              { label: 'Skills Missing', value: missingSkills.length, color: 'text-coral' },
              { label: 'Resume Words', value: resumeWordCount?.toLocaleString() || '—', color: 'text-ink-900' },
              { label: 'Job Skills Found', value: totalJobSkills || '—', color: 'text-sky' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-ink-50 rounded-2xl p-4">
                <div className={`font-display font-bold text-2xl ${color}`}>{value}</div>
                <div className="text-xs text-ink-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
        {filename && (
          <p className="text-xs font-mono text-ink-300 text-center mt-4">
            Analyzed: {filename}
          </p>
        )}
      </div>

      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-acid"></div>
            <h3 className="font-display font-semibold text-ink-900">
              Matched Skills
              <span className="ml-2 text-sm font-mono font-normal text-ink-400">({matchedSkills.length})</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map(skill => (
              <SkillPill key={skill} skill={skill} variant="matched" />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-coral"></div>
            <h3 className="font-display font-semibold text-ink-900">
              Missing Skills
              <span className="ml-2 text-sm font-mono font-normal text-ink-400">({missingSkills.length})</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map(skill => (
              <SkillPill key={skill} skill={skill} variant="missing" />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions?.length > 0 && (
        <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky"></div>
            <h3 className="font-display font-semibold text-ink-900">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-3">
            {suggestions.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs text-ink-300 mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-sm text-ink-600 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
