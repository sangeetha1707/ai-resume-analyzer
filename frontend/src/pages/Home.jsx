import { useState } from 'react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import ResultDisplay from '../components/ResultDisplay';
import { analyzeResume } from '../services/api';

export default function Home() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canAnalyze = resumeFile && jobDescription.trim().length >= 50;

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await analyzeResume(resumeFile, jobDescription);
      setResult(data);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeFile(null);
    setJobDescription('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ink-50 font-body">

      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1512 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-acid/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16">

        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-acid/20 border border-acid/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-acid-dark animate-pulse-slow"></span>
            <span className="font-mono text-xs text-acid-dark tracking-wider">AI-Powered Analysis</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink-900 leading-tight">
            Resume
            <span className="relative mx-3">
              <span className="relative z-10">Analyzer</span>
              <span className="absolute inset-x-0 bottom-1 h-3 bg-acid/40 -z-0 rounded"></span>
            </span>
          </h1>
          <p className="mt-4 text-ink-400 text-lg leading-relaxed max-w-xl">
            Upload your resume and paste a job description to get an instant match score, skill gap analysis, and personalized suggestions.
          </p>
        </header>

        {/* Input Card */}
        <div className="bg-white rounded-3xl border border-ink-100 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>

          <ResumeUpload file={resumeFile} onFileChange={setResumeFile} />

          <div className="h-px bg-ink-100" />

          <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

          {/* Error */}
          {error && (
            <div className="flex gap-3 items-start bg-coral/10 border border-coral/30 rounded-2xl p-4 animate-scale-in">
              <svg className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-sm text-coral">{error}</p>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className={`
              w-full py-4 px-6 rounded-2xl font-display font-semibold text-base
              transition-all duration-300 flex items-center justify-center gap-3
              ${canAnalyze && !loading
                ? 'bg-ink-900 hover:bg-ink-950 text-acid shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-ink-100 text-ink-300 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyzing Resume…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analyze Match
              </>
            )}
          </button>

          {!canAnalyze && (
            <p className="text-xs text-center text-ink-300 -mt-2">
              {!resumeFile && !jobDescription ? 'Upload a resume and add a job description to get started'
                : !resumeFile ? 'Upload your PDF resume to continue'
                : 'Add a complete job description (50+ characters) to continue'}
            </p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div id="results" className="mt-10">
            <ResultDisplay result={result} />
            <button
              onClick={handleReset}
              className="mt-8 w-full py-3 px-6 rounded-2xl border-2 border-ink-200 hover:border-ink-400 text-ink-400 hover:text-ink-900 font-display font-medium text-sm transition-all duration-200"
            >
              ↺ Analyze Another Resume
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs font-mono text-ink-300">
            Your resume is processed locally and never stored.
          </p>
        </footer>
      </div>
    </div>
  );
}
