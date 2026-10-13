import React, { useState } from 'react';
import {
  ThumbsUp,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  Pin,
  MessageSquare,
  Share2,
  Check,
  CornerDownRight,
  Send,
  Trash2,
  Camera,
  Lock,
} from 'lucide-react';
import { Testimonial } from '../types';
import { RatingStars } from './RatingStars';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onLike: (id: string) => void;
  isOwnerMode?: boolean;
  onReply?: (id: string, replyText: string) => void;
  onTogglePin?: (id: string) => void;
  onDelete?: (id: string) => void;
  storeName?: string;
}

const EMOTION_EMOJIS: Record<number, string> = {
  1: '😭',
  2: '🙁',
  3: '😐',
  4: '😊',
  5: '🤩',
};

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onLike,
  isOwnerMode = false,
  onReply,
  onTogglePin,
  onDelete,
  storeName = 'nekoplate.id',
}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      onLike(testimonial.id);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !onReply) return;
    onReply(testimonial.id, replyInput.trim());
    setReplyInput('');
    setIsReplying(false);
  };

  const handleCopyQuote = () => {
    const quoteText = `"${testimonial.comment}" — ${
      testimonial.isAnonymous ? 'Pelanggan Setia' : testimonial.name
    } (Kepuasan: ${testimonial.rating}/5 ${EMOTION_EMOJIS[testimonial.rating] || '⭐'}) via @${storeName}`;
    navigator.clipboard.writeText(quoteText);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return 'Baru saja';
    }
  };

  const displayName = testimonial.isAnonymous
    ? 'Pelanggan Terverifikasi (Anonim)'
    : testimonial.name || 'Pelanggan Terverifikasi';

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        testimonial.isPinned
          ? 'border-indigo-400 ring-2 ring-indigo-100 bg-gradient-to-b from-indigo-50/20 to-white'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: User Info & Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 bg-slate-100 shadow-xs flex items-center justify-center">
                <img
                  src={testimonial.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://api.dicebear.com/7.x/thumbs/svg?seed=fallback';
                  }}
                />
              </div>
              {testimonial.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs"
                  title="Pembeli Terverifikasi"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                  {displayName}
                </h4>
                {testimonial.isAnonymous && (
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    Anonim
                  </span>
                )}
                {testimonial.isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    <Pin className="w-2.5 h-2.5" />
                    Disematkan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {formatDate(testimonial.date)}
                </span>
              </div>
            </div>
          </div>

          {/* Star Rating + Emotion Emoji on the Right */}
          <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-2xl">
            <span className="text-2xl select-none" title={`Skor kepuasan: ${testimonial.rating}`}>
              {EMOTION_EMOJIS[testimonial.rating] || '😊'}
            </span>
            <div className="flex flex-col items-end">
              <RatingStars rating={testimonial.rating} size="sm" />
              <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                {testimonial.rating === 5
                  ? 'Sangat Bahagia'
                  : testimonial.rating === 4
                  ? 'Puas & Senang'
                  : testimonial.rating === 3
                  ? 'Cukup'
                  : testimonial.rating === 2
                  ? 'Kurang Puas'
                  : 'Sangat Sedih'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Item Badge & Permission Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {testimonial.orderItem && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700">
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-slate-400">Order:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                {testimonial.orderItem}
              </span>
            </div>
          )}

          {/* Social Media Content Permission Badge */}
          {testimonial.permissionToPostContent !== undefined &&
            testimonial.permissionToPostContent !== null && (
              <div
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
                  testimonial.permissionToPostContent
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={
                  testimonial.permissionToPostContent
                    ? 'Pelanggan bersedia karyanya dijadikan konten media sosial'
                    : 'Pelanggan meminta agar pesanannya tidak diunggah ke media sosial'
                }
              >
                {testimonial.permissionToPostContent ? (
                  <>
                    <Camera className="w-3 h-3 text-emerald-600" />
                    <span>Boleh Jadi Konten Medsos</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Konten Privat (No Post)</span>
                  </>
                )}
              </div>
            )}
        </div>

        {/* Comment Text */}
        <p className="text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
          &ldquo;{testimonial.comment}&rdquo;
        </p>

        {/* Tags */}
        {testimonial.tags && testimonial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {testimonial.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Owner Reply */}
        {testimonial.ownerReply && (
          <div className="mt-3 bg-indigo-50/70 border-l-3 border-indigo-600 p-3 rounded-r-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <CornerDownRight className="w-3.5 h-3.5 text-indigo-600" />
                Respon Resmi dari @{storeName}
              </span>
              <span className="text-[11px] text-indigo-400">
                {formatDate(testimonial.ownerReply.date)}
              </span>
            </div>
            <p className="text-xs text-slate-700 pl-5 leading-relaxed">
              {testimonial.ownerReply.text}
            </p>
          </div>
        )}

        {/* Owner Reply Form (Toggleable if in owner mode) */}
        {isOwnerMode && isReplying && (
          <form onSubmit={handleSendReply} className="mt-2 space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block">
              Tulis Balasan Pemilik untuk Pelanggan:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Terima kasih banyak atas ulasannya kak!..."
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" /> Balas
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {/* Like button */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              hasLiked
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'hover:bg-slate-200/70 text-slate-600'
            }`}
            title="Tandai ulasan ini membantu"
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-indigo-600' : ''}`} />
            <span>Membantu ({testimonial.likes + (hasLiked ? 1 : 0)})</span>
          </button>

          {/* Share Quote */}
          <button
            type="button"
            onClick={handleCopyQuote}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
            title="Salin ulasan ini"
          >
            {copiedQuote ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        {/* Owner controls */}
        {isOwnerMode && (
          <div className="flex items-center gap-2">
            {onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(testimonial.id)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  testimonial.isPinned
                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
                title={testimonial.isPinned ? 'Lepas sematan' : 'Sematkan ulasan di atas'}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{testimonial.ownerReply ? 'Edit Balasan' : 'Balas'}</span>
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Hapus testimoni ini?')) {
                    onDelete(testimonial.id);
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus ulasan (khusus pemilik)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
