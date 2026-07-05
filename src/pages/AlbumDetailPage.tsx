import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchItem, updateItem } from '../api';
import { type Album } from '../types'
import { getCoverGradient, getStatusBadge } from './CatalogPage';

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [noteText, setNoteText] = useState('');

  // Fetch single album
  const { data: album, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['items', id],
    queryFn: () => fetchItem(id!),
    enabled: !!id,
    retry: false, // Don't infinite retry on 404
  });

  // Sync note input with database value when loaded
  useEffect(() => {
    if (album) {
      setNoteText(album.note || '');
    }
  }, [album]);

  // Mutation for updates (status, rating, note)
  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Pick<Album, 'status' | 'rating' | 'note'>>) => {
      return updateItem(id!, updates);
    },
    onSuccess: (updatedAlbum) => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-2xl w-full max-w-sm mx-auto" />
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where item doesn't exist on server (no crash, show custom not found UX)
  if (isError || !album) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-sm">
        <div className="text-6xl">💿⚠️</div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Album Not Found</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The album you are looking for does not exist in this catalog. It may have been removed or entered incorrectly.
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
          >
            Retry Fetch
          </button>
          <Link
            to="/"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-indigo-600/20"
          >
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(album.status);
  const isPendingUpdate = updateMutation.isPending;
  const isNoteChanged = noteText !== (album.note || '');

  const handleStatusChange = (newStatus: Album['status']) => {
    updateMutation.mutate({ status: newStatus });
  };

  const handleRatingChange = (newRating: number | null) => {
    updateMutation.mutate({ rating: newRating });
  };

  const handleSaveNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateMutation.mutate({ note: noteText.trim() || null });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8 animate-fade-in">
      {/* Back navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <span>←</span>
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: Interactive Vinyl Album Art */}
        <div className="flex items-center justify-center p-4">
          <div className="relative group w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 select-none">
            {/* The Black Vinyl Record (slides out on hover) */}
            <div className="absolute inset-y-0 right-0 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 transition-all duration-700 ease-out translate-x-0 group-hover:translate-x-14 md:group-hover:translate-x-20 shadow-2xl z-0">
              {/* Vinyl grooves */}
              <div className="absolute inset-4 rounded-full border border-slate-800/30"></div>
              <div className="absolute inset-8 rounded-full border border-slate-800/30"></div>
              <div className="absolute inset-12 rounded-full border border-slate-800/30"></div>
              <div className="absolute inset-16 rounded-full border border-slate-800/30"></div>
              <div className="absolute inset-20 rounded-full border border-slate-800/30"></div>
              <div className="absolute inset-24 rounded-full border border-slate-800/30"></div>
              {/* Center record label */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br ${getCoverGradient(album.id)} flex items-center justify-center p-2.5 text-center text-[7px] sm:text-[9px] text-white font-bold uppercase tracking-wider overflow-hidden shadow-inner`}>
                <span className="line-clamp-2 drop-shadow-sm">{album.title}</span>
              </div>
              {/* Spindle hole */}
              <div className="absolute w-3 h-3 rounded-full bg-slate-950"></div>
            </div>

            {/* Premium Album Sleeve Cover (stays on top) */}
            <div className={`relative z-10 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-2xl bg-gradient-to-br ${getCoverGradient(album.id)} shadow-2xl flex flex-col justify-between p-6 sm:p-8 text-white font-extrabold uppercase border border-white/10`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full">{album.genre}</span>
                <span className="text-xs tracking-wider opacity-75">{album.year}</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-md line-clamp-3">{album.title}</h2>
                <p className="text-xs sm:text-sm tracking-wider opacity-90 font-medium">by {album.creator}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Album Details & Tracker Controls */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${badge.classes}`}>
              {badge.label}
            </span>
            <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{album.title}</h1>
            <p className="text-lg font-semibold text-slate-600 dark:text-slate-400">by {album.creator}</p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 pt-1">
              <span>Released: {album.year}</span>
              <span>•</span>
              <span>Genre: {album.genre}</span>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Controls section */}
          <div className="space-y-5">
            {/* Status Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Listening Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['want', 'active', 'done', 'dropped'] as const).map((statusVal) => {
                  const isActive = album.status === statusVal;
                  let colorClass = '';
                  switch (statusVal) {
                    case 'want':
                      colorClass = isActive ? 'bg-slate-600 text-white dark:bg-slate-700' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400';
                      break;
                    case 'active':
                      colorClass = isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400';
                      break;
                    case 'done':
                      colorClass = isActive ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-100 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400';
                      break;
                    case 'dropped':
                      colorClass = isActive ? 'bg-rose-600 text-white' : 'hover:bg-rose-100 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400';
                      break;
                  }

                  return (
                    <button
                      key={statusVal}
                      disabled={isPendingUpdate}
                      onClick={() => handleStatusChange(statusVal)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${colorClass} ${isActive ? 'scale-100 shadow-sm' : 'scale-95 opacity-80 hover:opacity-100'
                        }`}
                    >
                      {statusVal === 'want' ? 'Want to Listen' : statusVal === 'active' ? 'Listening' : statusVal === 'done' ? 'Finished' : 'Dropped'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating stars */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Personal Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-2xl">
                  {([1, 2, 3, 4, 5] as const).map((star) => (
                    <button
                      key={star}
                      type="button"
                      disabled={isPendingUpdate}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => handleRatingChange(star)}
                      className="text-amber-500 hover:scale-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                      aria-label={`Rate ${star} star`}
                    >
                      {star <= (hoverRating ?? album.rating ?? 0) ? '★' : '☆'}
                    </button>
                  ))}
                </div>
                {album.rating !== null && (
                  <button
                    disabled={isPendingUpdate}
                    onClick={() => handleRatingChange(null)}
                    className="text-[11px] font-bold uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline cursor-pointer ml-2"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Personal Listening Notes */}
            <form onSubmit={handleSaveNote} className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Listening Notes
                </label>
                <span className="text-[10px] text-slate-400">
                  {isPendingUpdate ? 'Saving changes...' : ''}
                </span>
              </div>

              <textarea
                id="notes"
                placeholder="What did you think of the production, favorite tracks, lyrics..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={isPendingUpdate}
                rows={4}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all shadow-sm resize-none"
                onBlur={() => {
                  if (isNoteChanged) handleSaveNote();
                }}
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isNoteChanged || isPendingUpdate}
                  className="px-4 py-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}