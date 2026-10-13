import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  Sparkles,
  User,
  Image as ImageIcon,
  ShoppingBag,
  ShieldCheck,
  Share2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Testimonial } from '../types';
import { PRESET_AVATARS, POPULAR_TAGS } from '../data/presetAvatars';
import { RatingEmotionSlider } from './RatingEmotionSlider';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newReview: Testimonial) => void;
  storeName?: string;
}

export const ReviewFormModal: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  storeName = 'nekoplate.id',
}) => {
  // Form state
  const [name, setName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [orderItem, setOrderItem] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    '⚡ Pengiriman Cepat',
    '💎 Kualitas Premium',
  ]);
  const [permissionToPostContent, setPermissionToPostContent] = useState<boolean | null>(true);

  // Avatar choices
  const [avatarMode, setAvatarMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_AVATARS[0].id);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Harap pilih file gambar (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCustomAvatarUrl(result);
      setAvatarMode('custom');
    };
    reader.readAsDataURL(file);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 5) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Silakan tuliskan ulasan komentar Anda terlebih dahulu.');
      return;
    }

    let finalAvatarUrl = '';
    let finalAvatarType: 'preset' | 'custom' = avatarMode;

    if (avatarMode === 'custom' && customAvatarUrl) {
      finalAvatarUrl = customAvatarUrl;
    } else {
      finalAvatarType = 'preset';
      const preset = PRESET_AVATARS.find((p) => p.id === selectedPresetId) || PRESET_AVATARS[0];
      finalAvatarUrl = preset.url;
    }

    const newTestimonial: Testimonial = {
      id: `testi-${Date.now()}`,
      name: isAnonymous ? '' : name.trim(),
      isAnonymous: isAnonymous || !name.trim(),
      avatarType: finalAvatarType,
      avatarUrl: finalAvatarUrl,
      presetAvatarId: avatarMode === 'preset' ? selectedPresetId : undefined,
      rating,
      comment: comment.trim(),
      orderItem: orderItem.trim() || undefined,
      date: new Date().toISOString(),
      verified: true,
      likes: 0,
      tags: selectedTags,
      permissionToPostContent,
    };

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    onSubmit(newTestimonial);
    onClose();
  };

  const currentPreset = PRESET_AVATARS.find((p) => p.id === selectedPresetId) || PRESET_AVATARS[0];
  const activeAvatarPreview =
    avatarMode === 'custom' && customAvatarUrl ? customAvatarUrl : currentPreset.url;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 font-bold border border-white/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold leading-tight">Beri Ulasan Pelanggan</h2>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  UMUM
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Ulasan untuk <span className="font-semibold text-white">@{storeName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup formulir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Section 1: Draggable Emotion Slider */}
          <div className="space-y-2">
            <RatingEmotionSlider
              value={rating}
              onChange={setRating}
              label="Geser dari emot sedih (1) hingga sangat bahagia (5):"
            />
          </div>

          {/* Section 2: Avatar & Profile Customization */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Foto Profil / Avatar Anda
              </label>
              <span className="text-xs text-slate-500">Pilih bawaan atau unggah foto</span>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAvatarMode('preset')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  avatarMode === 'preset'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Pilih Avatar Sistem (10 Pilihan)
              </button>
              <button
                type="button"
                onClick={() => setAvatarMode('custom')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  avatarMode === 'custom'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                Unggah Foto Sendiri
              </button>
            </div>

            {/* Preset Avatars */}
            {avatarMode === 'preset' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
                <p className="text-xs text-slate-500 mb-2.5 font-medium">
                  Pilih karakter avatar yang Anda sukai:
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {PRESET_AVATARS.map((avatar) => {
                    const isSelected = selectedPresetId === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedPresetId(avatar.id)}
                        className={`group relative p-1 rounded-xl transition-all cursor-pointer flex flex-col items-center ${
                          isSelected
                            ? 'ring-2 ring-indigo-600 ring-offset-2 scale-105 bg-white shadow-xs'
                            : 'hover:bg-white hover:scale-105'
                        }`}
                        title={avatar.name}
                      >
                        <div
                          className={`w-10 h-10 rounded-full ${avatar.bg} overflow-hidden border border-slate-200 flex items-center justify-center`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Custom Photo Upload */
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-600 shadow-md bg-white flex items-center justify-center shrink-0">
                    {customAvatarUrl ? (
                      <img
                        src={customAvatarUrl}
                        alt="Pratinjau Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {customAvatarUrl ? 'Foto profil terpilih' : 'Unggah foto profil Anda'}
                      </p>
                      <p className="text-xs text-slate-500">
                        Format JPG, PNG atau WebP (maks. 5MB).
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {customAvatarUrl ? 'Ganti Foto' : 'Pilih File Foto'}
                      </button>
                      {customAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setCustomAvatarUrl('')}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                    {uploadError && (
                      <p className="text-xs text-rose-600 font-medium">{uploadError}</p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Name & Anonymous Option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="customer-name" className="text-sm font-bold text-slate-800">
                Nama Anda <span className="text-xs font-normal text-slate-500">(Boleh dikosongkan)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-600">
                  Kirim sebagai Anonim
                </span>
              </label>
            </div>

            <div className="relative">
              <input
                id="customer-name"
                type="text"
                disabled={isAnonymous}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isAnonymous
                    ? 'Nama disamarkan (akan tampil sebagai "Pelanggan / Anonim")'
                    : 'Contoh: Rendi Pratama atau kosongkan jika ingin anonim'
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                  isAnonymous
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-slate-800'
                }`}
                maxLength={40}
              />
              <div className="absolute right-3 top-2.5">
                <img
                  src={activeAvatarPreview}
                  alt="Avatar preview"
                  className="w-6 h-6 rounded-full border border-slate-200 object-cover"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Identitas Anda aman. Anda bebas mengisi nama asli atau menyamarkannya.
            </p>
          </div>

          {/* Section 4: Order item with updated placeholder */}
          <div className="space-y-1.5">
            <label htmlFor="order-item" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              Produk / Layanan yang Dibeli <span className="text-xs font-normal text-slate-500">(Opsional)</span>
            </label>
            <input
              id="order-item"
              type="text"
              value={orderItem}
              onChange={(e) => setOrderItem(e.target.value)}
              placeholder="Contoh: Desain Poster / Percetakan / Sosial Media"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 outline-none transition-all"
              maxLength={80}
            />
          </div>

          {/* Section 5: Text Comment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="review-comment" className="text-sm font-bold text-slate-800">
                Ulasan & Pengalaman Anda <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">{comment.length}/500</span>
            </div>
            <textarea
              id="review-comment"
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan kesan Anda tentang kualitas hasil karya, respon admin, kecepatan pengerjaan, atau kepuasan Anda..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 outline-none transition-all resize-none"
              maxLength={500}
            />
          </div>

          {/* Section 6: Izin Karya / Pesanan Dijadikan Konten (Opsional) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  Izin Portofolio / Konten Media Sosial
                  <span className="text-xs font-normal text-slate-500">(Opsional)</span>
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Apakah Anda bersedia hasil karya / pesanan ini diunggah sebagai konten medsos portofolio kami?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setPermissionToPostContent(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  permissionToPostContent === true
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Ya, Bersedia Diposting
              </button>

              <button
                type="button"
                onClick={() => setPermissionToPostContent(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                  permissionToPostContent === false
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Tidak, Tolong Privasi
              </button>
            </div>
            {permissionToPostContent !== null && (
              <p className="text-[11px] text-slate-500 italic">
                {permissionToPostContent
                  ? '✨ Terima kasih! Karya Anda boleh kami tampilkan di feeds/story.'
                  : '🔒 Siap! Privasi pesanan Anda akan kami jaga sepenuhnya.'}
              </p>
            )}
          </div>

          {/* Section 7: Highlight Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Sorotan Positif:
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 hover:from-black hover:to-indigo-800 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Kirim Testimoni Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
