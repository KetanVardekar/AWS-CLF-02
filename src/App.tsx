import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { CheatSheet } from './pages/CheatSheet';
// Exams carry ~1,100 questions, so they load only when opened.
const ExamList = lazy(() => import('./pages/ExamList').then((m) => ({ default: m.ExamList })));
const ExamPage = lazy(() => import('./pages/ExamPage').then((m) => ({ default: m.ExamPage })));
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
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">☁️ CLF-C02 Prep</NavLink>
          <nav>
            <NavLink to="/" end>Cheat Sheet</NavLink>
            <NavLink to="/exams">Practice Exams</NavLink>
            <NavLink to="/categories">By Category</NavLink>
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
