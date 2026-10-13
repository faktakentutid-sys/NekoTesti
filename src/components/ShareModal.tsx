import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, QrCode, ExternalLink, Sparkles } from 'lucide-react';
import { StoreProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeProfile: StoreProfile;
  onOpenCustomerDirectPage: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  storeProfile,
  onOpenCustomerDirectPage,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaTemplate, setCopiedWaTemplate] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://testimu.app';
  // Share link with direct mode query
  const directLink = `${currentOrigin}/#order-review`;

  const waTemplate = `Halo kak! Terima kasih banyak sudah order di *${storeProfile.name}* 🙏✨

Mohon kesediaannya untuk memberikan ulasan & rating pengalaman belanja kakak melalui tautan berikut:
👉 ${directLink}

Kakak boleh mengisi nama atau memilih *anonim*, serta memilih foto avatar yang disukai. Masukan kakak sangat berharga bagi kami untuk terus berkembang. Terima kasih! ❤️`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyWa = () => {
    navigator.clipboard.writeText(waTemplate);
    setCopiedWaTemplate(true);
    setTimeout(() => setCopiedWaTemplate(false), 2000);
  };

  const handleShareToWhatsApp = () => {
    const encoded = encodeURIComponent(waTemplate);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bagikan Tautan ke Pembeli</h2>
              <p className="text-emerald-100 text-xs">
                Kirimkan link formulir testimoni setiap selesai transaksi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Direct Link Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Tautan Langsung Formulir Pelanggan:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directLink}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-700 select-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Kirim via WhatsApp Langsung
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCustomerDirectPage();
              }}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 text-blue-600" />
              Uji Coba Tampilan Pembeli
            </button>
          </div>

          {/* WhatsApp Text Template Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Template Pesan Ramah Pelanggan
              </span>
              <button
                type="button"
                onClick={handleCopyWa}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedWaTemplate ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Salin Teks
                  </>
                )}
              </button>
            </div>
            <div className="text-xs text-slate-600 whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200 font-sans leading-relaxed">
              {waTemplate}
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-12 h-12 text-slate-800" />
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Cetak QR Code untuk Paket Pengiriman</p>
              <p className="text-[11px] text-slate-500">
                Tempel stiker QR Code pada kemasan/kartu ucapan pesanan agar pembeli cukup scan kamera untuk menulis testimoni!
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
