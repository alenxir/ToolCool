import React from 'react';
import { X, Volume2, VolumeX, Eye, Moon, Sun, Globe } from 'lucide-react';
import { SupportedLocale, UserSettings } from '../../types';
import { SUPPORTED_LOCALES } from '../../data/locales';
import { playClickSound } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121416]/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FFFFFF] rounded-xl border border-[#E5DFD8] shadow-xl overflow-hidden p-6 text-[#181A1B] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE5DE]">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#181A1B]">
              Preferences
            </h2>
            <p className="text-xs text-[#6C7278] mt-0.5">
              Customize sound feedback, interface language, and display.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F2ECE6] text-[#7A8086] hover:text-[#181A1B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-5 text-sm">
          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FAF4ED] text-[#C85A17] flex items-center justify-center shrink-0">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="font-semibold text-xs text-[#181A1B]">
                  Sound Feedback
                </div>
                <div className="text-[11px] text-[#71767B]">
                  Subtle harmonic tones on upload, processing, and download
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.soundEnabled}
              onClick={() => {
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
                playClickSound();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEnabled ? 'bg-[#C85A17]' : 'bg-[#D6D0C9]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform duration-150 shadow-xs absolute top-1 ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0F4F5] text-[#1F4E5B] flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#181A1B]">
                  Reduced Motion
                </div>
                <div className="text-[11px] text-[#71767B]">
                  Minimize animations and transition effects
                </div>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.reducedMotion}
              onClick={() => {
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
                playClickSound();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.reducedMotion ? 'bg-[#1F4E5B]' : 'bg-[#D6D0C9]'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform duration-150 shadow-xs absolute top-1 ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-[#7A8086]" />
              <label className="font-semibold text-xs text-[#181A1B]">
                Language / भाषा
              </label>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => {
                    playClickSound();
                    onUpdateSettings({ locale: loc.code });
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer text-left ${
                    settings.locale === loc.code
                      ? 'border-[#C85A17] bg-[#FAF4ED] text-[#C85A17] font-semibold'
                      : 'border-[#EBE5DE] bg-[#FFFFFF] hover:bg-[#F9F7F4] text-[#3B4045]'
                  }`}
                >
                  <span>{loc.name}</span>
                  <span className="text-[11px] opacity-75 font-normal">
                    {loc.nativeName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#EBE5DE] flex justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
