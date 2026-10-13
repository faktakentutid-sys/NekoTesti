import React from 'react';
import { Star, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Testimonial, FilterRating } from '../types';

interface RatingSummaryProps {
  testimonials: Testimonial[];
  activeFilter: FilterRating;
  onFilterChange: (filter: FilterRating) => void;
  onOpenReviewModal: () => void;
  onOpenShareModal: () => void;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  testimonials,
  activeFilter,
  onFilterChange,
  onOpenReviewModal,
  onOpenShareModal,
}) => {
  const totalCount = testimonials.length;

  const averageRating = totalCount > 0
    ? testimonials.reduce((acc, t) => acc + t.rating, 0) / totalCount
    : 5;

  const countsByStar = {
    5: testimonials.filter((t) => t.rating === 5).length,
    4: testimonials.filter((t) => t.rating === 4).length,
    3: testimonials.filter((t) => t.rating === 3).length,
    2: testimonials.filter((t) => t.rating === 2).length,
    1: testimonials.filter((t) => t.rating === 1).length,
  };

  const satisfiedCount = countsByStar[5] + countsByStar[4];
  const satisfactionRate = totalCount > 0 ? Math.round((satisfiedCount / totalCount) * 100) : 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-7">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Overall score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div className="text-5xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
            {averageRating.toFixed(1)}
            <span className="text-xl font-semibold text-slate-400">/5</span>
          </div>

          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'
                }`}
              />
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Berdasarkan {totalCount} Ulasan Pembeli
          </p>

          <div className="mt-3 pt-3 border-t border-slate-200 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{satisfactionRate}% pembeli sangat puas</span>
          </div>
        </div>

        {/* Center Column: Star Distribution Bars */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Distribusi Kepuasan</span>
            {activeFilter !== 'all' && (
              <button
                onClick={() => onFilterChange('all')}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Reset Filter (Tampilkan Semua)
              </button>
            )}
          </div>

          {([5, 4, 3, 2, 1] as (5 | 4 | 3 | 2 | 1)[]).map((star) => {
            const count = countsByStar[star];
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            const isFilterActive = activeFilter === star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => onFilterChange(isFilterActive ? 'all' : star)}
                className={`w-full flex items-center gap-3 group text-left px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  isFilterActive ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-50'
                }`}
                title={`Filter hanya ulasan ${star} bintang`}
              >
                <div className="flex items-center gap-1 w-14 shrink-0 text-xs font-bold text-slate-700">
                  <span>{star}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      star >= 4
                        ? 'bg-amber-400 group-hover:bg-amber-500'
                        : star === 3
                        ? 'bg-amber-300'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="w-12 text-right shrink-0 text-xs text-slate-500 font-medium">
                  {count} <span className="text-[10px] text-slate-400">({Math.round(percentage)}%)</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Call to Actions */}
        <div className="lg:col-span-3 flex flex-col gap-3 justify-center">
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              100% Ulasan Nyata
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Pelanggan dapat bebas mengisi nama atau anonim dengan foto profil kustom.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenReviewModal}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300 group-hover:scale-110 transition-transform" />
            Tulis Ulasan Saya
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
          >
            🔗 Bagikan Tautan Formulir ke Pembeli
          </button>
        </div>
      </div>
    </div>
  );
};
