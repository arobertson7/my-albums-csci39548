import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchItems } from '../api';

export function getCoverGradient(id: number) {
  const gradients = [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-emerald-400 via-teal-500 to-blue-600',
    'from-amber-400 via-orange-500 to-rose-600',
    'from-fuchsia-500 via-violet-600 to-indigo-700',
    'from-sky-400 via-blue-500 to-indigo-600',
    'from-cyan-400 to-blue-500',
    'from-rose-400 to-pink-600',
    'from-violet-600 to-indigo-800',
    'from-emerald-500 to-teal-700',
    'from-yellow-400 via-red-500 to-pink-500',
  ];
  return gradients[id % gradients.length];
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'want':
      return { label: 'Want to Listen', classes: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
    case 'active':
      return { label: 'Listening', classes: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-700/10' };
    case 'done':
      return { label: 'Finished', classes: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-700/10' };
    case 'dropped':
      return { label: 'Dropped', classes: 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-700/10' };
    default:
      return { label: status, classes: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' };
  }
}

export function renderRatingStars(rating: number | null) {
  if (rating === null || rating === undefined) return null;
  return (
    <div className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 text-sm">
      {Array.from({ length: 5 }).map((_, idx) => (
        <span key={idx} className={idx < rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: albums, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filteredAlbums = albums?.filter((album) => {
    const searchStr = `${album.title} ${album.creator} ${album.genre}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  }) || [];

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-center space-y-4">
        <div className="text-4xl">❌</div>
        <h2 className="text-xl font-bold text-rose-800 dark:text-rose-200">Failed to Load Catalog</h2>
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {error instanceof Error ? error.message : 'An error occurred while fetching the albums catalog.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-500 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 compact:space-y-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Music Catalog</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse and search through your entire music tracker ({albums?.length || 0} albums).
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search albums, artists, or genres..."
            value={query}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all shadow-sm"
          />
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 compact:gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 compact:p-3 space-y-4 compact:space-y-3 animate-pulse">
              <div className="aspect-square w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredAlbums.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-8 space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="text-5xl">🎵</div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Albums Found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No albums match your search query "{query}". Try checking the spelling or resetting the search.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        /* Albums Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 compact:gap-4">
          {filteredAlbums.map((album) => {
            const badge = getStatusBadge(album.status);
            return (
              <Link
                key={album.id}
                to={`/items/${album.id}`}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-4 compact:p-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* Simulated Vinyl Record Sleeve Cover */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 compact:mb-3 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                  {/* Vinyl slip-out effect */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-90 dark:opacity-85 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-white font-extrabold text-2xl select-none shadow-inner border border-white/10 dark:border-white/5 rounded-xl block z-10 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCoverGradient(album.id)}`} />
                    <span className="relative z-10 drop-shadow-md text-center px-4 font-black tracking-wider uppercase text-sm leading-snug">
                      {album.title}
                    </span>
                  </div>
                </div>

                <div className="flex-grow space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {album.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
                      {album.year}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-1">
                    by {album.creator}
                  </div>

                  <div className="text-[11px] font-medium tracking-wide uppercase text-slate-400 dark:text-slate-500">
                    {album.genre}
                  </div>
                </div>

                <div className="mt-4 compact:mt-3 pt-3 compact:pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badge.classes}`}>
                    {badge.label}
                  </span>
                  {renderRatingStars(album.rating)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}