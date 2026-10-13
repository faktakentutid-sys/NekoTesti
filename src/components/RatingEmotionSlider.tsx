import React from 'react';
import { Star } from 'lucide-react';

interface RatingEmotionSliderProps {
  value: number; // 1 to 5
  onChange: (value: number) => void;
  label?: string;
}

export interface EmotionStep {
  level: number;
  emoji: string;
  title: string;
  desc: string;
  color: string;
  bgGradient: string;
  badgeBg: string;
  trackColor: string;
}

export const EMOTIONS: EmotionStep[] = [
  {
    level: 1,
    emoji: '😭',
    title: 'Sangat Kecewa',
    desc: 'Pesanan tidak sesuai harapan / sedih',
    color: 'text-rose-600',
    bgGradient: 'from-rose-500 to-red-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
    trackColor: '#f43f5e',
  },
  {
    level: 2,
    emoji: '🙁',
    title: 'Kurang Puas',
    desc: 'Ada beberapa kekurangan / kurang senang',
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-amber-600',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
    trackColor: '#f97316',
  },
  {
    level: 3,
    emoji: '😐',
    title: 'Cukup / Standar',
    desc: 'Biasa saja, sesuai dengan yang diminta',
    color: 'text-amber-600',
    bgGradient: 'from-amber-400 to-yellow-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    trackColor: '#eab308',
  },
  {
    level: 4,
    emoji: '😊',
    title: 'Puas & Senang',
    desc: 'Hasilnya bagus dan memuaskan hati!',
    color: 'text-emerald-600',
    bgGradient: 'from-teal-500 to-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    trackColor: '#10b981',
  },
  {
    level: 5,
    emoji: '🤩',
    title: 'Sangat Bahagia & Luar Biasa!',
    desc: 'Sempurna banget, melebihi ekspektasi!',
    color: 'text-indigo-600',
    bgGradient: 'from-blue-600 via-indigo-600 to-pink-500',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    trackColor: '#6366f1',
  },
];

export const RatingEmotionSlider: React.FC<RatingEmotionSliderProps> = ({
  value,
  onChange,
  label = 'Geser emot di bawah ini untuk menilai:',
}) => {
  const currentEmotion = EMOTIONS.find((e) => e.level === value) || EMOTIONS[4];
  const progressPercent = ((value - 1) / 4) * 100;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      {/* Title & Active Emotion Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block">
            Tingkat Kepuasan Pesanan
          </span>
          <p className="text-xs text-slate-600 font-medium">{label}</p>
        </div>

        {/* Big Emotion Display */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-2xl self-start sm:self-auto shadow-xs">
          <div className="text-3xl sm:text-4xl animate-bounce-short select-none">
            {currentEmotion.emoji}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-black ${currentEmotion.color}`}>
                {currentEmotion.title}
              </span>
              <span className="text-xs font-bold text-amber-500 flex items-center">
                ({value} <Star className="w-3 h-3 fill-amber-400 inline ml-0.5" />)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{currentEmotion.desc}</p>
          </div>
        </div>
      </div>

      {/* The Draggable Range Slider */}
      <div className="relative pt-2 pb-1">
        {/* Track Background */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
          <div
            className={`h-full bg-gradient-to-r ${currentEmotion.bgGradient} transition-all duration-200 rounded-full`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Native Range Input layered over track */}
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-x-0 top-1 w-full h-5 opacity-0 cursor-pointer z-20"
          aria-label="Geser tingkat kepuasan ulasan"
        />

        {/* Visual Custom Thumb Knob */}
        <div
          className="absolute top-0.5 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-3 border-indigo-600 shadow-md flex items-center justify-center transition-all duration-200 pointer-events-none z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="w-2 h-2 rounded-full bg-indigo-600" />
        </div>
      </div>

      {/* Clickable Emotion Buttons Row (from Sad to Super Happy) */}
      <div className="grid grid-cols-5 gap-1 pt-1">
        {EMOTIONS.map((emotion) => {
          const isSelected = emotion.level === value;
          return (
            <button
              key={emotion.level}
              type="button"
              onClick={() => onChange(emotion.level)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-slate-100 ring-2 ring-indigo-500 scale-105 shadow-xs'
                  : 'hover:bg-slate-50 opacity-70 hover:opacity-100 hover:scale-102'
              }`}
              title={`${emotion.level} Bintang - ${emotion.title}`}
            >
              <span className="text-2xl sm:text-3xl transition-transform duration-150">
                {emotion.emoji}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-bold mt-1 text-center truncate max-w-full ${
                  isSelected ? emotion.color : 'text-slate-600'
                }`}
              >
                {emotion.level === 1
                  ? 'Sedih'
                  : emotion.level === 2
                  ? 'Kurang'
                  : emotion.level === 3
                  ? 'Cukup'
                  : emotion.level === 4
                  ? 'Puas'
                  : 'Bahagia!'}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {emotion.level} ⭐
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 border-t border-slate-100 pt-2">
        <span className="flex items-center gap-1 text-rose-500 font-medium">
          😭 Sedih / Kecewa
        </span>
        <span className="font-semibold text-slate-500">
          ← Geser untuk menentukan →
        </span>
        <span className="flex items-center gap-1 text-indigo-600 font-medium">
          Sangat Bahagia 🤩
        </span>
      </div>
    </div>
  );
};
