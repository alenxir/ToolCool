import React, { useState } from 'react';
import {
  Search,
  Settings,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  Wrench,
  BookOpen,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { SupportedLocale } from '../../types';
import { TRANSLATIONS } from '../../data/locales';
import { playClickSound } from '../../utils/audio';

interface NavbarProps {
  currentView: string;
  locale: SupportedLocale;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  locale,
  onNavigate,
  onOpenSearch,
  onOpenSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'tools', label: t.navTools },
    { id: 'exams', label: t.navExams },
    { id: 'guides', label: t.navGuides },
    { id: 'about', label: t.navAbout },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#EBE5DE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              playClickSound();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 cursor-pointer text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#181A1B] text-white flex items-center justify-center font-black text-sm tracking-tighter group-hover:bg-[#C85A17] transition-colors">
              TC
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#181A1B]">
                ToolCool
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.2 rounded bg-[#FAF4ED] text-[#C85A17] text-[10px] font-bold tracking-wide border border-[#E8DFD3]">
                ExamReady
              </span>
            </div>
          </button>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  playClickSound();
                  onNavigate(item.id);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentView === item.id
                    ? 'bg-[#F4EFEA] text-[#181A1B]'
                    : 'text-[#5C6166] hover:text-[#181A1B] hover:bg-[#FAF8F5]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {/* Quick search input trigger */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSearch();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E0D9D1] bg-[#FAF8F5] hover:bg-[#FFFFFF] text-[#71767B] hover:text-[#181A1B] text-xs font-medium transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#8A8F95]" />
            <span className="hidden sm:inline-block">Search tools & exams</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-[#FFFFFF] border border-[#D5CFC9] font-mono text-[10px] text-[#71767B]">
              ⌘K
            </kbd>
          </button>

          {/* Preferences button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSettings();
            }}
            title="Preferences & Language"
            className="p-2 rounded-lg border border-[#E0D9D1] bg-white hover:bg-[#FAF8F5] text-[#5C6166] hover:text-[#181A1B] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-[#E0D9D1] bg-white text-[#181A1B] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EBE5DE] bg-white px-4 py-3 space-y-1 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                playClickSound();
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                currentView === item.id
                  ? 'bg-[#FAF4ED] text-[#C85A17] font-bold'
                  : 'text-[#3B4045] hover:bg-[#FAF8F5]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#F0EBE5] flex items-center justify-between text-xs text-[#71767B] px-3">
            <span>Client-side on-device privacy</span>
            <span className="font-semibold text-[#C85A17]">v2.4 Production</span>
          </div>
        </div>
      )}
    </header>
  );
};
