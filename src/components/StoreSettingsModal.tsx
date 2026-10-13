import React, { useState, useRef } from 'react';
import { X, Settings, Upload, Image as ImageIcon, Sparkles, RefreshCw, Check } from 'lucide-react';
import { StoreProfile } from '../types';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StoreProfile;
  onSave: (updated: StoreProfile) => void;
  onResetData: () => void;
}

const GRADIENT_PRESETS = [
  { id: 'dark-jdm', label: 'Dark Aesthetic', class: 'from-slate-950 via-slate-900 to-indigo-950' },
  { id: 'neon-cyber', label: 'Neon Cyber', class: 'from-violet-900 via-indigo-900 to-cyan-900' },
  { id: 'carbon-racing', label: 'Carbon Black', class: 'from-zinc-900 via-stone-900 to-black' },
  { id: 'royal-blue', label: 'Royal Blue', class: 'from-blue-900 via-indigo-800 to-slate-900' },
  { id: 'warm-sunset', label: 'Sunset Glow', class: 'from-amber-700 via-rose-800 to-purple-900' },
];

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  onResetData,
}) => {
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [category, setCategory] = useState(profile.category);
  const [phoneOrWa, setPhoneOrWa] = useState(profile.phoneOrWa || '');
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
  const [customBannerUrl, setCustomBannerUrl] = useState(profile.customBannerUrl || '');
  const [bannerGradient, setBannerGradient] = useState(profile.bannerGradient);

  const logoFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran foto profil maksimal 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran foto banner maksimal 8 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomBannerUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      name: name.trim() || 'nekoplate.id',
      tagline: tagline.trim() || 'Spesialis Plat Nomor Custom Akrilik & Frame Aesthetic',
      category: category.trim() || 'Custom Plate & Otomotif Aesthetic',
      phoneOrWa: phoneOrWa.trim(),
      logoUrl,
      customBannerUrl: customBannerUrl.trim() || undefined,
      bannerGradient,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Pengaturan Brand & Profil Pemilik</h2>
              <p className="text-slate-400 text-xs">Atur foto profil, banner, dan info nekoplate.id</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Foto Profil Toko */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Foto Profil Toko / Logo:
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl border-2 border-indigo-600 bg-white p-1 overflow-hidden shrink-0 shadow-md">
                <img
                  src={logoUrl}
                  alt="Logo Toko"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Unggah Foto Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoUrl('https://api.dicebear.com/7.x/bottts-neutral/svg?seed=nekoplate-black&backgroundColor=0f172a')}
                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium rounded-lg cursor-pointer"
                  >
                    Reset Bawaan
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Gunakan foto logo atau karakter nekoplate.id (JPG, PNG maks. 5MB)
                </p>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Banner Header */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Foto Banner Toko:
            </label>

            {/* Banner Preview */}
            <div className="relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
              {customBannerUrl ? (
                <img
                  src={customBannerUrl}
                  alt="Banner Toko"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-r ${bannerGradient} flex items-center justify-center text-white text-xs font-semibold`}>
                  <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" />
                  Pratinjau Banner Gradasi
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => bannerFileRef.current?.click()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                Unggah Foto Banner Kustom
              </button>
              {customBannerUrl && (
                <button
                  type="button"
                  onClick={() => setCustomBannerUrl('')}
                  className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-medium rounded-lg cursor-pointer"
                >
                  Hapus Foto Banner
                </button>
              )}
              <input
                ref={bannerFileRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
            </div>

            {/* Gradient Options when no custom banner */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Atau pilih tema gradasi bawaan:
              </span>
              <div className="flex flex-wrap gap-2">
                {GRADIENT_PRESETS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => {
                      setBannerGradient(grad.class);
                      setCustomBannerUrl('');
                    }}
                    className={`h-7 px-3 rounded-lg text-[11px] font-bold text-white flex items-center gap-1 bg-gradient-to-r ${grad.class} transition-all cursor-pointer ${
                      bannerGradient === grad.class && !customBannerUrl
                        ? 'ring-2 ring-indigo-500 ring-offset-2 scale-105'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {bannerGradient === grad.class && !customBannerUrl && <Check className="w-3 h-3" />}
                    {grad.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Informasi Teks */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Nama Profil / Brand:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="nekoplate.id"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Slogan / Deskripsi:
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Spesialis Plat Nomor Custom Akrilik & Frame Aesthetic"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Kategori Usaha:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Custom Plate & Otomotif Aesthetic"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Nomor WhatsApp Toko:
              </label>
              <input
                type="text"
                value={phoneOrWa}
                onChange={(e) => setPhoneOrWa(e.target.value)}
                placeholder="6281234567890"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Kembalikan ke data bawaan nekoplate.id?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Awal
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-md"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
