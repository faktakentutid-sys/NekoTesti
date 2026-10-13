import React, { useState, useRef } from 'react';
import {
  Sparkles,
  User,
  Upload,
  Check,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Store,
  Image as ImageIcon,
  Share2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Testimonial, StoreProfile } from '../types';
import { PRESET_AVATARS, POPULAR_TAGS } from '../data/presetAvatars';
import { RatingEmotionSlider } from './RatingEmotionSlider';

interface CustomerDirectPageProps {
  storeProfile: StoreProfile;
  onSubmit: (testimonial: Testimonial) => void;
  onBackToFeed: () => void;
}

export const CustomerDirectPage: React.FC<CustomerDirectPageProps> = ({
  storeProfile,
  onSubmit,
  onBackToFeed,
}) => {
  // Form states
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setCustomAvatarUrl(event.target?.result as string);
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
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }

    onSubmit(newTestimonial);
    setIsSubmitted(true);
  };

  const currentPreset = PRESET_AVATARS.find((p) => p.id === selectedPresetId) || PRESET_AVATARS[0];
  const activeAvatarPreview =
    avatarMode === 'custom' && customAvatarUrl ? customAvatarUrl : currentPreset.url;

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Terima Kasih Banyak!</h2>
            <p className="text-sm text-slate-600 mt-2">
              Ulasan dan rating Anda untuk <span className="font-bold text-slate-800">{storeProfile.name}</span> telah berhasil dikirim dan kini tampil di feed ulasan publik.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left flex items-center gap-3">
            <img
              src={activeAvatarPreview}
              alt="Avatar"
              className="w-12 h-12 rounded-full border border-slate-200 object-cover shrink-0"
            />
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-800 truncate">
                  {isAnonymous ? 'Pelanggan Anonim' : name || 'Pelanggan'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-1 italic">&ldquo;{comment}&rdquo;</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-indigo-600">{rating} / 5 ⭐</span>
                {permissionToPostContent !== null && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${permissionToPostContent ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {permissionToPostContent ? 'Boleh jadi konten' : 'Privat'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToFeed}
            className="w-full py-3 px-6 bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-black hover:to-indigo-950 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            Lihat di Feed Testimoni Publik
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      {/* Top back button */}
      <button
        type="button"
        onClick={onBackToFeed}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Halaman Feed Toko
      </button>

      {/* Store Banner Card */}
      <div className="rounded-3xl shadow-lg relative overflow-hidden border border-slate-800">
        {storeProfile.customBannerUrl ? (
          <div className="h-44 sm:h-52 w-full relative">
            <img
              src={storeProfile.customBannerUrl}
              alt="Banner Toko"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            <div className="absolute inset-0 p-6 sm:p-8 flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md shrink-0 border-2 border-white">
                <img
                  src={storeProfile.logoUrl}
                  alt={storeProfile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="text-white">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 text-[11px] font-semibold mb-1 backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  NekoTesti • Formulir Ulasan Pelanggan
                </div>
                <h1 className="text-xl sm:text-2xl font-black">{storeProfile.name}</h1>
                <p className="text-xs text-slate-200 mt-1 line-clamp-1">{storeProfile.tagline}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className={`bg-gradient-to-r ${storeProfile.bannerGradient} p-6 sm:p-8 text-white relative`}>
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md shrink-0 border-2 border-white">
                <img
                  src={storeProfile.logoUrl}
                  alt={storeProfile.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-amber-200 text-[11px] font-semibold mb-1 backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  NekoTesti • Formulir Ulasan Pelanggan
                </div>
                <h1 className="text-xl sm:text-2xl font-black">{storeProfile.name}</h1>
                <p className="text-xs text-slate-200 mt-1 line-clamp-1">{storeProfile.tagline}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-800">
              Bagikan Pengalaman Pesanan Anda
            </h2>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Tanpa Perlu Login
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Beri penilaian tingkat kepuasan, pilih avatar atau unggah foto, dan ulasan Anda langsung tayang!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emotion Slider */}
          <div className="space-y-2">
            <RatingEmotionSlider
              value={rating}
              onChange={setRating}
              label="Geser dari emot sedih (1) hingga sangat bahagia (5):"
            />
          </div>

          {/* Avatar & Photo Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                Pilihan Foto Profil / Avatar
              </label>
              <span className="text-xs text-slate-400">Pilih bawaan atau unggah foto</span>
            </div>

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
                Gunakan Avatar Sistem (10 Pilihan)
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

            {avatarMode === 'preset' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs text-slate-500 mb-2 font-medium">Pilih avatar yang Anda suka:</p>
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
                    <p className="text-xs text-slate-600">
                      Unggah foto diri atau profil (JPG/PNG maks. 5MB)
                    </p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {customAvatarUrl ? 'Ganti Foto' : 'Pilih Foto Galeri'}
                      </button>
                      {customAvatarUrl && (
                        <button
                          type="button"
                          onClick={() => setCustomAvatarUrl('')}
                          className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Hapus
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

          {/* Name & Anonymous Option */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="direct-name" className="text-sm font-bold text-slate-800">
                Nama Anda <span className="text-xs font-normal text-slate-500">(Bebas diisi atau tidak)</span>
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
                id="direct-name"
                type="text"
                disabled={isAnonymous}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isAnonymous
                    ? 'Nama disamarkan (akan muncul sebagai "Pelanggan Terverifikasi")'
                    : 'Contoh: Ahmad Fauzi atau nama panggilan Anda'
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none ${
                  isAnonymous
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-white border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                }`}
                maxLength={40}
              />
              <div className="absolute right-3 top-2.5">
                <img
                  src={activeAvatarPreview}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full border border-slate-200 object-cover"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Privasi Anda aman. Anda tidak wajib memasukkan data pribadi sensitif.
            </p>
          </div>

          {/* Order Item - updated placeholder */}
          <div className="space-y-1.5">
            <label htmlFor="direct-order-item" className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              Produk atau Layanan yang Dibeli <span className="text-xs font-normal text-slate-500">(Opsional)</span>
            </label>
            <input
              id="direct-order-item"
              type="text"
              value={orderItem}
              onChange={(e) => setOrderItem(e.target.value)}
              placeholder="Contoh: Desain Poster / Percetakan / Sosial Media"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all"
              maxLength={80}
            />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="direct-comment" className="text-sm font-bold text-slate-800">
                Ulasan / Komentar Anda <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">{comment.length}/500</span>
            </div>
            <textarea
              id="direct-comment"
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalaman Anda: kualitas hasil pengerjaan, respon admin, ketepatan waktu, dll..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm outline-none transition-all resize-none"
              maxLength={500}
            />
          </div>

          {/* Permission to post content */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-600" />
                Izin Konten Media Sosial / Portofolio
                <span className="text-xs font-normal text-slate-500">(Opsional)</span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Apakah Anda bersedia hasil karya pesanan ini diunggah sebagai konten portofolio kami?
              </p>
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
                  ? '✨ Boleh diposting ke medsos portofolio!'
                  : '🔒 Aman, pesanan Anda tidak akan kami upload ke medsos.'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Sorotan Pengalaman:
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

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 hover:from-black hover:to-indigo-800 text-white text-base font-bold rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              Kirim Ulasan Sekarang
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Ulasan Anda akan langsung tampil di etalase testimoni publik nekoplate.id.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
