import React from 'react';
import {
  Cat,
  Share2,
  PlusCircle,
  Settings,
  Eye,
  Store,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { StoreProfile } from '../types';

interface NavbarProps {
  currentView: 'feed' | 'customer-direct';
  onViewChange: (view: 'feed' | 'customer-direct') => void;
  onOpenReviewModal: () => void;
  onOpenShareModal: () => void;
  onOpenSettingsModal: () => void;
  isOwnerLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onOwnerLogout: () => void;
  storeProfile: StoreProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenReviewModal,
  onOpenShareModal,
  onOpenSettingsModal,
  isOwnerLoggedIn,
  onOpenLoginModal,
  onOwnerLogout,
  storeProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Store Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onViewChange('feed')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-800 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform border border-slate-700">
              <Cat className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  NekoTesti
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold truncate max-w-[140px] sm:max-w-[200px]">
                @{storeProfile.name}
              </p>
            </div>
          </button>
        </div>

        {/* View Switcher Pills */}
        <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => onViewChange('feed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'feed'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Feed Publik & Statistik
          </button>
          <button
            type="button"
            onClick={() => onViewChange('customer-direct')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'customer-direct'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            Simulasi Tautan Pembeli
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Owner Mode Actions */}
          {isOwnerLoggedIn ? (
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 p-1 rounded-2xl">
              <button
                type="button"
                onClick={onOpenSettingsModal}
                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Atur Foto Profil, Banner & Info Toko"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Atur Profil & Banner</span>
              </button>
              <button
                type="button"
                onClick={onOwnerLogout}
                className="p-1.5 text-indigo-700 hover:text-rose-600 hover:bg-white rounded-xl transition-colors cursor-pointer"
                title="Keluar dari akun pemilik"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
              title="Khusus Pemilik Toko (Password: 1228)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Login Pemilik</span>
            </button>
          )}

          {/* Share Button */}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="px-2.5 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            title="Bagikan Tautan ke Pelanggan"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Bagikan Link</span>
          </button>

          {/* Write Review CTA for public */}
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="px-3.5 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Beri Ulasan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
