import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="relative mb-6">
        <div className="text-9xl font-black tracking-widest text-slate-200 dark:text-slate-800 select-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-bounce">⚠️</span>
        </div>
      </div>
      
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">
        Track Not Found
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-sm sm:text-base leading-relaxed">
        The record you are looking for has been misplaced or never existed in this catalog. Let's get you back to the main list.
      </p>
      
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold text-sm transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 dark:shadow-indigo-500/20 hover:scale-105 active:scale-95"
      >
        Back to Catalog 💿
      </Link>
    </div>
  );
}