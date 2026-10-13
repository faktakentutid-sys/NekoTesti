import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

const RATING_LABELS: Record<number, { text: string; color: string; desc: string }> = {
  1: { text: 'Kecewa', color: 'text-rose-500', desc: 'Produk/layanan mengecewakan' },
  2: { text: 'Kurang Puas', color: 'text-orange-500', desc: 'Masih banyak kekurangan' },
  3: { text: 'Cukup Baik', color: 'text-amber-500', desc: 'Standar sesuai harapan' },
  4: { text: 'Puas Banget', color: 'text-emerald-500', desc: 'Bagus dan memuaskan' },
  5: { text: 'Sempurna & Mantap!', color: 'text-emerald-600', desc: 'Sangat luar biasa!' },
};

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  interactive = false,
  onRatingChange,
  size = 'md',
  showLabel = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`transition-all duration-150 ${
                interactive
                  ? 'cursor-pointer hover:scale-115 active:scale-95 focus:outline-none p-1 rounded-full hover:bg-amber-50'
                  : 'cursor-default'
              }`}
              title={`${starValue} Bintang`}
              aria-label={`${starValue} Bintang`}
            >
              <Star
                className={`${sizeClasses[size]} transition-colors duration-150 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.3)]'
                    : 'text-slate-300 fill-slate-100 hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
        {rating > 0 && !interactive && !showLabel && (
          <span className="ml-1 text-xs font-bold text-amber-600">
            {rating.toFixed(1)}
          </span>
        )}
      </div>

      {showLabel && activeRating > 0 && RATING_LABELS[activeRating] && (
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-sm font-bold ${RATING_LABELS[activeRating].color}`}>
            {RATING_LABELS[activeRating].text}
          </span>
          <span className="text-xs text-slate-400">
            • {RATING_LABELS[activeRating].desc}
          </span>
        </div>
      )}
    </div>
  );
};
