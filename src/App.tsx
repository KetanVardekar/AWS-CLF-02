import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { CheatSheet } from './pages/CheatSheet';
// Exams carry ~1,100 questions, so they load only when opened.
const ExamList = lazy(() => import('./pages/ExamList').then((m) => ({ default: m.ExamList })));
const ExamPage = lazy(() => import('./pages/ExamPage').then((m) => ({ default: m.ExamPage })));
const Syllabus = lazy(() => import('./pages/Syllabus').then((m) => ({ default: m.Syllabus })));
const Categories = lazy(() => import('./pages/Categories').then((m) => ({ default: m.Categories })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));

type Theme = 'light' | 'dark';

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem('clf-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function App() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const header = useRef<HTMLElement>(null);

  // Sticky bars below the header need its real height (it grows when the nav wraps on phones).
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const update = () => document.documentElement.style.setProperty('--topbar-h', `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('clf-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return (
    <HashRouter>
      <header className="topbar" ref={header}>
        <div className="topbar-inner">
          <NavLink to="/" className="brand">☁️ CLF-C02 Prep</NavLink>
          <nav>
            <NavLink to="/" end>Cheat Sheet</NavLink>
            <NavLink to="/exams"><span className="long">Practice </span>Exams</NavLink>
            <NavLink to="/categories"><span className="long">By </span><span className="long">Category</span><span className="short">Categories</span></NavLink>
            <NavLink to="/syllabus">Syllabus</NavLink>
          </nav>
          <button className="theme-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>
      <main className="container">
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <Routes>
            <Route path="/" element={<CheatSheet />} />
            <Route path="/exams" element={<ExamList />} />
            <Route path="/exams/:id" element={<ExamPage />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="container footer">
        Practice questions from{' '}
        <a href="https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes" target="_blank" rel="noreferrer">kananinirav/AWS-Certified-Cloud-Practitioner-Notes</a>{' '}
        (MIT License, © 2022 kananinirav). Not affiliated with or endorsed by Amazon Web Services.
      </footer>
    </HashRouter>
  );
}
