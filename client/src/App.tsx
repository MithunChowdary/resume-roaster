import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Flame, FileText, CheckCircle, AlertTriangle, X, Hash, Skull, Moon, Sun } from 'lucide-react';

// --- Components ---

const CautionTape = ({ count }: { count: number }) => {
    // We create a seamless loop by duplicating the content enough times
    // Using two containers for the infinite scroll technique
    const text = (
        <span className="mx-12 font-bold tracking-widest min-w-max">
            ⚠️ YOUR CV IS NEXT &nbsp;&nbsp;•&nbsp;&nbsp; {count > 0 ? count : 0} EGOS HURT &nbsp;&nbsp;•&nbsp;&nbsp; 💀 100% ACCURACY &nbsp;&nbsp;•&nbsp;&nbsp; 🚫 ZERO SYMPATHY &nbsp;&nbsp;•&nbsp;&nbsp; 📉 UNEMPLOYMENT RISING
        </span>
    );

    return (
        <div className="w-[120vw] -ml-[10vw] relative bg-[var(--tape-bg)] text-[var(--tape-text)] font-black uppercase text-sm md:text-base py-3 overflow-hidden shadow-xl border-y-4 border-black rotate-[-1deg] my-12 opacity-90 select-none transform transition-transform hover:rotate-0 hover:scale-[1.01] z-50">
            <div className="flex animate-marquee w-max">
                {/* Repeat enough times to ensure seamless loop on large screens */}
                <div className="flex shrink-0">
                    {Array(10).fill("").map((_, i) => <span key={`a-${i}`}>{text}</span>)}
                </div>
                <div className="flex shrink-0">
                    {Array(10).fill("").map((_, i) => <span key={`b-${i}`}>{text}</span>)}
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const reviews = [
        { text: "I thought my resume was perfect until this AI humbled me. Fixed the typos and actually got a call back.", author: "Sarah J.", role: "Product Manager" },
        { text: "Brutal but necessary. The ATS score check showed me why I wasn't passing the bots. Increased my match rate from 30% to 85%.", author: "Michael Chen", role: "Software Engineer" },
        { text: "My ego is bruised but my CV is polished. Best career advice I've received in years, even if it was from an AI.", author: "Priya R.", role: "Data Analyst" },
    ];

    return (
        <div className="py-16 px-6 relative z-10 transition-colors duration-500">
            <h3 className="text-center text-3xl font-black mb-12 uppercase tracking-tight text-[var(--text-main)]">
                <span className="text-red-500">Survivor</span> Stories
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {reviews.map((r, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl relative group hover:-translate-y-2 transition-transform duration-300">
                        <div className="absolute -top-4 -left-4 text-4xl opacity-50 text-[var(--text-muted)]">❝</div>
                        <p className="text-lg italic mb-6 text-[var(--text-main)] font-medium leading-relaxed">"{r.text}"</p>
                        <div className="flex items-center gap-3 border-t border-[var(--glass-border)] pt-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center font-bold text-xs text-white">
                                {r.author[0]}
                            </div>
                            <div>
                                <p className="font-bold text-sm text-[var(--text-main)]">{r.author}</p>
                                <p className="text-xs text-[var(--text-muted)]">{r.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Footer = () => (
    <footer className="w-full max-w-6xl mx-auto px-6 py-8 mt-12 border-t border-[var(--glass-border)] flex flex-col md:flex-row justify-between items-start md:items-center text-xs text-[var(--text-muted)] gap-4 transition-colors duration-500">
        <div className="font-mono relative group cursor-help">
            Built by <span className="text-red-500 font-bold decoration-dotted underline underline-offset-4">Mithun Chowdary</span>

            {/* Bio Hover Card */}
            <div className="absolute bottom-full left-0 mb-4 w-64 bg-black/90 backdrop-blur-xl border border-red-500/30 p-4 rounded-xl shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-orange-500 flex items-center justify-center font-bold text-white text-lg">M</div>
                    <div>
                        <p className="text-white font-bold text-sm">Mithun Chowdary</p>
                        <p className="text-red-400 text-[10px] uppercase tracking-wider">Full Stack Dev • AI</p>
                    </div>
                </div>
                <p className="text-gray-400 leading-snug">
                    Building tools no one asked for but everyone needs.
                </p>
                {/* Little arrow */}
                <div className="absolute -bottom-2 left-6 w-4 h-4 bg-black/90 border-r border-b border-red-500/30 transform rotate-45"></div>
            </div>
        </div>

        <div className="max-w-md text-left opacity-80 border border-red-500/50 p-4 rounded-lg bg-red-500/5">
            <div className="text-red-500 font-bold mb-1 uppercase tracking-wider">
                ⚠️ DISCLAIMER
            </div>
            <p>
                We are not responsible for emotional damage, career crises, or tears shed.
                <br />
                <span className="italic opacity-80">Buy Burnol before using. This is for entertainment purposes (mostly).</span>
            </p>
        </div>
    </footer>
);

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [mode, setMode] = useState<'roast' | 'ats' | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [roastLanguage, setRoastLanguage] = useState<'english' | 'hindi' | 'telugu'>('english');
    const [totalProcessed, setTotalProcessed] = useState<number>(0);
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        // Check local storage or system preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved as 'dark' | 'light';
            return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        // Apply theme to root
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Fetch stats on mount
    useEffect(() => {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        fetch(`${API_BASE}/api/stats`)
            .then(res => res.json())
            .then(data => setTotalProcessed(data.totalProcessed || 0))
            .catch(console.error);
    }, []);

    // Scroll to results when ready
    useEffect(() => {
        if (result && !loading) {
            // Use a slightly longer timeout to account for Framer Motion animation
            setTimeout(() => {
                const element = document.getElementById('results-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 300);
        }
    }, [result, loading]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (selectedMode: 'roast' | 'ats') => {
        if (!file) return;
        setMode(selectedMode);
        setLoading(true);
        setResult(null);
        setRoastLanguage('english'); // Reset language on new roast

        const formData = new FormData();
        formData.append('resume', file);

        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const endpoint = selectedMode === 'roast' ? `${API_BASE}/api/roast` : `${API_BASE}/api/ats-check`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            console.log("App.tsx received data:", data);
            setResult(data);
            // Update counter locally to reflect success immediately
            if (!data.error) setTotalProcessed(prev => prev + 1);
        } catch (error) {
            console.error(error);
            alert('Something went wrong! Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-red-500/30 overflow-x-hidden pt-0 transition-colors duration-500">

            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center z-10 relative container mx-auto">
                <div className="flex items-center gap-2">
                    <Flame className="text-red-500 w-6 h-6" />
                    <h1 className="font-bold text-xl tracking-wider">ROASTER<span className="text-red-500">.AI</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-panel px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2">
                        <Hash className="w-3 h-3 text-red-500" />
                        <span>{totalProcessed} Roasts Served</span>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="glass-btn p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 relative z-0">

                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter"
                    >
                        Review your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600 neon-text">Resume</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto"
                    >
                        Get a brutal roast or a professional ATS check. Increase your hiring chances with AI-powered insights.
                    </motion.p>
                </div>

                {/* Main Interface */}
                <div className="grid md:grid-cols-2 gap-6 relative">

                    {/* File Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] border-dashed border-2 border-[var(--glass-border)] hover:border-red-500/50 transition-colors group relative overflow-hidden"
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                                {file ? <CheckCircle className="text-green-400 w-8 h-8" /> : <Upload className="text-red-400 w-8 h-8" />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{file ? file.name : "Drop Resume PDF"}</h3>
                                <p className="text-sm text-[var(--text-muted)] mt-1">{file ? "Ready to analyze" : "Max size: 5MB"}</p>
                            </div>
                        </div>

                        {/* Background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="space-y-4 flex flex-col justify-center">

                        <button
                            onClick={() => !file ? document.querySelector<HTMLInputElement>('input[type="file"]')?.click() : handleSubmit('roast')}
                            disabled={loading}
                            className="glass-btn w-full p-6 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/5 hover:scale-[1.02] relative overflow-hidden cursor-pointer"
                        >
                            {!file && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm font-bold text-sm tracking-wider text-white">UPLOAD RESUME FIRST</div>}

                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-500/10 rounded-xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                    <Flame className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-xl group-hover:text-red-400 transition-colors">Brutal Roast</h3>
                                    <p className="text-sm text-[var(--text-muted)]">Funny, mean, & actionable.</p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                <span className="text-2xl">🔥</span>
                            </div>
                        </button>

                        <button
                            onClick={() => !file ? document.querySelector<HTMLInputElement>('input[type="file"]')?.click() : handleSubmit('ats')}
                            disabled={loading}
                            className="glass-btn w-full p-6 rounded-2xl flex items-center justify-between group transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/5 hover:scale-[1.02] relative overflow-hidden cursor-pointer"
                        >
                            {!file && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm font-bold text-sm tracking-wider text-white">UPLOAD RESUME FIRST</div>}

                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-xl group-hover:text-blue-400 transition-colors">ATS Score</h3>
                                    <p className="text-sm text-[var(--text-muted)]">Optimize for the bots.</p>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                                <span className="text-2xl">🤖</span>
                            </div>
                        </button>

                    </div>
                </div>

                <CautionTape count={totalProcessed} />

                {/* Results Area */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-block animate-pulse-slow">
                                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            </div>
                            <p className="text-red-300 font-mono animate-pulse">ANALYZING DOCUMENT...</p>
                        </motion.div>
                    )}

                    {result && !loading && (
                        <motion.div
                            id="results-section"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden"
                        >
                            <button onClick={() => setResult(null)} className="absolute top-6 right-6 p-2 hover:bg-[var(--btn-glass-hover)] rounded-full transition-colors"><X className="w-5 h-5" /></button>

                            {/* Error State */}
                            {result.error && (
                                <div className="text-center space-y-4">
                                    <div className="inline-block p-4 rounded-full bg-red-500/20 text-red-500 mb-2">
                                        <AlertTriangle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-red-500">Analysis Failed</h3>
                                    <p className="text-[var(--text-muted)] font-mono text-sm max-w-lg mx-auto bg-black/30 p-4 rounded-xl border border-red-500/20">
                                        {result.error}: {result.details || "Unknown error"}
                                    </p>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* Roast Mode - Only show if no error */}
                            {mode === 'roast' && !result.error && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-6xl">🔥</span>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase text-red-500">The Verdict</h3>
                                            <p className="text-[var(--text-muted)]">Status: <span className="text-red-500 font-bold uppercase">COOKED</span></p>
                                        </div>
                                    </div>

                                    {/* Language Switcher Tabs */}
                                    <div className="flex justify-center gap-2 mb-6">
                                        {(['english', 'hindi', 'telugu'] as const).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => setRoastLanguage(lang)}
                                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${roastLanguage === lang
                                                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                                                    : 'bg-[var(--btn-glass)] text-[var(--text-muted)] hover:bg-[var(--btn-glass-hover)]'
                                                    }`}
                                            >
                                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                            </button>
                                        ))}
                                    </div>

                                    {/* ROAST OUTPUT AS POINTS */}
                                    <div className="prose prose-invert max-w-none">
                                        <div className="border-l-4 border-red-500 pl-6 my-8 text-[var(--text-main)] min-h-[100px] space-y-4">
                                            {result.roast && result.roast[roastLanguage] ? (
                                                Array.isArray(result.roast[roastLanguage]) ? (
                                                    <ul className="list-none space-y-4">
                                                        {result.roast[roastLanguage].map((point: string, idx: number) => (
                                                            <li key={idx} className="flex gap-3 text-lg md:text-xl font-medium leading-relaxed italic">
                                                                <Skull className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                                                <span>"{point}"</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    // Fallback for old responses or single strings
                                                    <p className="text-xl md:text-2xl font-medium leading-relaxed italic">
                                                        "{result.roast[roastLanguage]}"
                                                    </p>
                                                )
                                            ) : (
                                                <p>Roast loading...</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                                        {result.improvements?.map((tip: string, i: number) => (
                                            <div key={i} className="bg-[var(--glass-bg)] p-6 rounded-xl border border-[var(--glass-border)]">
                                                <span className="text-red-400 font-mono text-xs mb-2 block">TIP #{i + 1}</span>
                                                <p className="font-medium text-[var(--text-main)]">{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ATS Mode - Only show if no error */}
                            {mode === 'ats' && !result.error && (
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="text-6xl">🤖</span>
                                        <div>
                                            <h3 className="text-3xl font-black uppercase text-blue-500">ATS Report</h3>
                                            <p className="text-[var(--text-muted)]">Match Rate: <span className="text-[var(--text-main)] font-bold">{result.ats_score}%</span></p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-sm border-b border-[var(--glass-border)] pb-2">Analysis Summary</h4>
                                            <p className="text-[var(--text-main)] leading-relaxed">{result.summary}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-bold text-[var(--text-muted)] uppercase tracking-wider text-sm border-b border-[var(--glass-border)] pb-2">Keywords Found</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.keywords_found?.map((k: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-medium">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {result.formatting_issues?.length > 0 && (
                                        <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl">
                                            <h4 className="flex items-center gap-2 font-bold text-yellow-500 mb-4">
                                                <AlertTriangle className="w-5 h-5" /> Formatting Issues
                                            </h4>
                                            <ul className="list-disc list-inside space-y-2 text-[var(--text-main)]">
                                                {result.formatting_issues.map((issue: string, i: number) => (
                                                    <li key={i}>{issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                        </motion.div>
                    )}

                </AnimatePresence>

                <Testimonials />

            </main>

            <Footer />
        </div>
    );
}
