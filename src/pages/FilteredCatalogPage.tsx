import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchItems } from '../api';
import { getCoverGradient, getStatusBadge, renderRatingStars } from './CatalogPage';

const VALID_STATUSES = ['want', 'active', 'done', 'dropped'];

function getStatusTitle(status: string) {
  switch (status) {
    case 'want':
      return { title: 'Want to Listen ⏳', desc: 'Albums you plan to check out next.' };
    case 'active':
      return { title: 'Currently Listening 🎧', desc: 'Albums you are spinning right now.' };
    case 'done':
      return { title: 'Finished 🏆', desc: 'Albums you have fully listened to.' };
    case 'dropped':
      return { title: 'Dropped 🛑', desc: 'Albums you set aside or did not finish.' };
    default:
      return { title: 'Filtered Catalog', desc: 'Filtered list of music albums.' };
  }
}

export default function FilteredCatalogPage() {
  const { status } = useParams<{ status: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Validate status parameter
  const isValidStatus = status && VALID_STATUSES.includes(status);

  const { data: albums, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    enabled: isValidStatus, // Only run query if status is valid
  });

  if (!isValidStatus) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">Invalid Status Filter</h2>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          The status filter "{status}" is not recognized. Valid options are: want, active, done, dropped.
        </p>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          Back to Full Catalog
        </Link>
      </div>
    );
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filteredAlbums = albums?.filter((album) => {
    // Check status
    if (album.status !== status) return false;

    // Check search query
    const searchStr = `${album.title} ${album.creator} ${album.genre}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  }) || [];

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-center space-y-4">
        <div className="text-4xl">❌</div>
        <h2 className="text-xl font-bold text-rose-800 dark:text-rose-200">Failed to Load Filtered Catalog</h2>
        <p className="text-sm text-rose-600 dark:text-rose-400">
          {error instanceof Error ? error.message : 'An error occurred while fetching the albums.'}
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

  const meta = getStatusTitle(status);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">{meta.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {meta.desc} Found {filteredAlbums.length} match{filteredAlbums.length !== 1 ? 'es' : ''}.
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
            placeholder="Search within this list..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 space-y-4 animate-pulse">
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
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No Albums in this List</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {query
              ? `No albums matching "${query}" were found under the "${status}" status.`
              : `You don't have any albums marked as "${status}" yet.`}
          </p>
          {query ? (
            <button
              onClick={() => setSearchParams({})}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Clear Search Filter
            </button>
          ) : (
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors animate-pulse"
            >
              Explore Full Catalog
            </Link>
          )}
        </div>
      ) : (
        /* Albums Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => {
            const badge = getStatusBadge(album.status);
            return (
              <Link
                key={album.id}
                to={`/items/${album.id}`}
                className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                {/* Simulated Vinyl Record Sleeve Cover */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
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

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
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