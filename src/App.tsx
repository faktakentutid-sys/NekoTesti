import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Store,
  Share2,
  PlusCircle,
  TrendingUp,
  RotateCcw,
  Camera,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  Testimonial,
  StoreProfile,
  SortOption,
  FilterRating,
} from './types';
import {
  INITIAL_TESTIMONIALS,
  INITIAL_STORE_PROFILE,
} from './data/initialTestimonials';
import { Navbar } from './components/Navbar';
import { RatingSummary } from './components/RatingSummary';
import { TestimonialCard } from './components/TestimonialCard';
import { ReviewFormModal } from './components/ReviewFormModal';
import { ShareModal } from './components/ShareModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { CustomerDirectPage } from './components/CustomerDirectPage';

const STORAGE_TESTIMONIALS_KEY = 'nekotesti_testimonials_v1';
const STORAGE_STORE_KEY = 'nekotesti_store_profile_v1';
const STORAGE_OWNER_SESSION_KEY = 'nekotesti_owner_session_v1';

export default function App() {
  // Persistence load
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TESTIMONIALS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_TESTIMONIALS;
  });

  const [storeProfile, setStoreProfile] = useState<StoreProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name === 'Sentra Karya Kreatif') {
          return INITIAL_STORE_PROFILE;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_STORE_PROFILE;
  });

  // Owner authentication state (Default false, public does not need login)
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_OWNER_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Current view: 'feed' or 'customer-direct'
  const [currentView, setCurrentView] = useState<'feed' | 'customer-direct'>('feed');

  // Modals state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Filtering & Sorting
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [ratingFilter, setRatingFilter] = useState<FilterRating>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TESTIMONIALS_KEY, JSON.stringify(testimonials));
    } catch {
      // storage error
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STORE_KEY, JSON.stringify(storeProfile));
    } catch {
      // storage error
    }
  }, [storeProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_OWNER_SESSION_KEY, isOwnerLoggedIn ? 'true' : 'false');
    } catch {
      // storage error
    }
  }, [isOwnerLoggedIn]);

  // Check URL hash on initial load
  useEffect(() => {
    if (window.location.hash === '#order-review') {
      setCurrentView('customer-direct');
    }
  }, []);

  // Handlers
  const handleAddTestimonial = (newReview: Testimonial) => {
    setTestimonials((prev) => [newReview, ...prev]);
  };

  const handleLike = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  const handleOwnerReply = (id: string, text: string) => {
    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ownerReply: {
                text,
                date: new Date().toISOString(),
              },
            }
          : t
      )
    );
  };

  const handleTogglePin = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = () => {
    setTestimonials(INITIAL_TESTIMONIALS);
    setStoreProfile(INITIAL_STORE_PROFILE);
    localStorage.removeItem(STORAGE_TESTIMONIALS_KEY);
    localStorage.removeItem(STORAGE_STORE_KEY);
  };

  // Filter & Sort Logic
  const filteredAndSortedTestimonials = useMemo(() => {
    let result = [...testimonials];

    // Filter by rating
    if (ratingFilter !== 'all') {
      result = result.filter((t) => t.rating === ratingFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.comment.toLowerCase().includes(q) ||
          (t.orderItem && t.orderItem.toLowerCase().includes(q)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      // Always put pinned items first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortBy) {
        case 'highest':
          if (b.rating !== a.rating) return b.rating - a.rating;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'lowest':
          if (a.rating !== b.rating) return a.rating - b.rating;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'most_helpful':
          return b.likes - a.likes;
        case 'newest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [testimonials, ratingFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenReviewModal={() => setIsReviewModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOwnerLogout={() => setIsOwnerLoggedIn(false)}
        storeProfile={storeProfile}
      />

      {/* Main View Router */}
      {currentView === 'customer-direct' ? (
        <main className="flex-1">
          <CustomerDirectPage
            storeProfile={storeProfile}
            onSubmit={handleAddTestimonial}
            onBackToFeed={() => setCurrentView('feed')}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
          {/* Hero Banner with Store Profile */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-white">
            {/* Banner Media */}
            <div className="h-36 sm:h-48 relative overflow-hidden">
              {storeProfile.customBannerUrl ? (
                <img
                  src={storeProfile.customBannerUrl}
                  alt="Banner Toko"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${storeProfile.bannerGradient}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Banner Top/Right Quick Buttons */}
              <div className="absolute right-4 bottom-4 flex flex-wrap gap-2">
                {isOwnerLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 shadow-xs"
                    title="Ganti Banner Toko"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    Atur Banner
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3.5 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-white/20 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  Bagikan Link Ulasan
                </button>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
                <div className="flex items-end gap-4">
                  {/* Store Logo with optional quick edit */}
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0 border-2 border-white overflow-hidden">
                      <img
                        src={storeProfile.logoUrl}
                        alt={storeProfile.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    {isOwnerLoggedIn && (
                      <button
                        type="button"
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="absolute inset-0 bg-black/50 text-white rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Ganti Foto Profil"
                      >
                        <Camera className="w-4 h-4 mb-0.5" />
                        Ganti Foto
                      </button>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {storeProfile.name}
                      </h1>
                      <span className="text-[11px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                        {storeProfile.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                      {storeProfile.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 hover:from-black hover:to-indigo-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    Beri Ulasan Sekarang
                  </button>
                </div>
              </div>

              {/* Owner mode active notification banner */}
              {isOwnerLoggedIn ? (
                <div className="mt-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      👑
                    </div>
                    <div>
                      <span className="font-extrabold text-indigo-950 block">
                        Mode Pemilik Aktif (@nekoplate.id)
                      </span>
                      <span className="text-indigo-700 text-[11px]">
                        Anda dapat mengatur foto profil & banner, membalas ulasan, serta menyematkan ulasan terbaik.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsSettingsModalOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
                    >
                      Atur Profil & Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOwnerLoggedIn(false)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-[11px] text-slate-400 hover:text-indigo-600 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    Pemilik toko nekoplate.id? Klik di sini untuk login
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Overall Rating & Statistics Section */}
          <section aria-label="Statistik Ulasan">
            <RatingSummary
              testimonials={testimonials}
              activeFilter={ratingFilter}
              onFilterChange={setRatingFilter}
              onOpenReviewModal={() => setIsReviewModalOpen(true)}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          </section>

          {/* Feed Filter & Sorting Bar */}
          <section className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
              {/* Rating Pill Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
                <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter:
                </span>
                <button
                  type="button"
                  onClick={() => setRatingFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    ratingFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({testimonials.length})
                </button>

                {([5, 4, 3, 2, 1] as (5 | 4 | 3 | 2 | 1)[]).map((star) => {
                  const count = testimonials.filter((t) => t.rating === star).length;
                  const isSelected = ratingFilter === star;
                  const emot = star === 5 ? '🤩' : star === 4 ? '😊' : star === 3 ? '😐' : star === 2 ? '🙁' : '😭';
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingFilter(star)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{emot}</span>
                      <span>{star}</span>
                      <Star
                        className={`w-3 h-3 ${
                          isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'
                        }`}
                      />
                      <span className="text-[10px] opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Sort Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari ulasan / produk..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Sort Option (Highest, Lowest, Newest, Oldest) */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-medium text-slate-500 shrink-0">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:border-indigo-600 outline-none cursor-pointer"
                  >
                    <option value="highest">⭐ Rating Tertinggi (🤩)</option>
                    <option value="newest">🕒 Ulasan Terbaru</option>
                    <option value="lowest">📉 Rating Terendah (😭)</option>
                    <option value="oldest">⏳ Ulasan Terlama</option>
                    <option value="most_helpful">👍 Paling Membantu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active filters indicators */}
            {(ratingFilter !== 'all' || searchQuery) && (
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100/80 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>
                    Menampilkan <strong>{filteredAndSortedTestimonials.length}</strong> ulasan
                  </span>
                  {ratingFilter !== 'all' && (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                      Hanya {ratingFilter} Bintang
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                      Kata kunci: &ldquo;{searchQuery}&rdquo;
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setRatingFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-indigo-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Filter
                </button>
              </div>
            )}
          </section>

          {/* Testimonial Cards Grid */}
          <section aria-label="Daftar Ulasan Pelanggan">
            {filteredAndSortedTestimonials.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Tidak ada testimoni yang cocok
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Cobalah mengganti kata kunci pencarian atau memilih filter rating yang lain.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRatingFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Tampilkan Semua Ulasan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredAndSortedTestimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    onLike={handleLike}
                    isOwnerMode={isOwnerLoggedIn}
                    onReply={handleOwnerReply}
                    onTogglePin={handleTogglePin}
                    onDelete={handleDeleteTestimonial}
                    storeName={storeProfile.name}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Bottom Callout */}
          <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1 md:col-span-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 bg-white/10 px-2.5 py-1 rounded-full mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                  Kumpulkan Ulasan Tanpa Hambatan
                </div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Pelanggan Beri Ulasan Langsung, Pemilik Kelola Mudah!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Pelanggan umum dapat langsung memberikan ulasan dengan menggeser emot sedih hingga bahagia, memilih izin konten medsos, dan nama bebas diisi atau anonim. Pemilik (@nekoplate.id) cukup login dengan password 1228 untuk mengatur profil dan banner.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:items-end">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-slate-950" />
                  Salin Tautan WhatsApp Pembeli
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('customer-direct')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer text-center"
                >
                  Lihat Tampilan Pembeli (Direct)
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-800" />
            <span className="font-extrabold text-slate-900">NekoTesti</span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700">{storeProfile.name}</span>
            <span className="hidden sm:inline text-slate-400">• Portal Testimoni Pelanggan</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Bagikan Link
            </button>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="hover:text-indigo-600 cursor-pointer"
            >
              Tulis Review
            </button>
            {isOwnerLoggedIn ? (
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="hover:text-indigo-600 cursor-pointer font-bold text-indigo-600"
              >
                Atur Profil & Banner
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hover:text-indigo-600 cursor-pointer font-medium"
              >
                Login Pemilik (1228)
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddTestimonial}
        storeName={storeProfile.name}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        storeProfile={storeProfile}
        onOpenCustomerDirectPage={() => setCurrentView('customer-direct')}
      />

      <StoreSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={storeProfile}
        onSave={setStoreProfile}
        onResetData={handleResetData}
      />

      <OwnerLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsOwnerLoggedIn(true)}
      />
    </div>
  );
}
