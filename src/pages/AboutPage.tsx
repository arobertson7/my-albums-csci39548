export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          About My Albums
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Your personal tracking system for exploring, rating, and documenting your musical journey.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
            💿
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Catalog tracking</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Keep a clean inventory of every album you want to listen to, are currently spinning, finished, or decided to drop.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
            ⭐
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Ratings &amp; Reviews</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Rate your albums from 1 to 5 stars and add personal listening notes to remember your favorite tracks, moments, and production highlights.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-lg">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Instant Search</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Quickly filter through artists, genres, or albums. Your search query persists dynamically in the URL, making it fully shareable and refresh-surviveable.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg">
            🌓
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Theme Customization</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Whether you prefer a bright morning setup or a sleek dark theme for late night listening, your preference is saved and loaded instantly.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 p-8 border border-indigo-500/10 dark:border-indigo-500/5 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Happy Listening! 🎧</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          This project was built with React, React Router, TanStack Query, and styled using Tailwind CSS. The data layer runs locally on a JSON server to keep your tracker fast and responsive.
        </p>
      </div>
    </div>
  );
}
