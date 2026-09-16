import React, { useState } from 'react';
import {
  Upload,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Camera,
  FileSignature,
  FileText,
  Calculator,
  Layers,
  Wand2,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ALL_TOOLS, TOOL_CATEGORIES } from '../../data/tools';
import { VERIFIED_EXAMS } from '../../data/exams';
import { GUIDES } from '../../data/guides';
import { AdSlot } from '../common/AdSlot';
import { SupportedLocale } from '../../types';
import { TRANSLATIONS } from '../../data/locales';
import { playClickSound } from '../../utils/audio';

interface HomeViewProps {
  locale: SupportedLocale;
  onSelectTool: (slug: string) => void;
  onSelectExam: (slug: string) => void;
  onSelectGuide: (slug: string) => void;
  onNavigate: (view: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  locale,
  onSelectTool,
  onSelectExam,
  onSelectGuide,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  const filteredTools = ALL_TOOLS.filter((tool) => {
    if (selectedCategory === 'all') return true;
    return tool.category === selectedCategory;
  });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center border-b border-[#EAE3DA]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4ED] text-[#C85A17] border border-[#E8DFD3] text-[11px] font-bold tracking-wider uppercase mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.heroEyebrow}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#181A1B] max-w-3xl mx-auto leading-[1.15]">
          {t.heroHeading}
        </h1>

        <p className="mt-4 text-sm sm:text-base text-[#5C6166] max-w-2xl mx-auto leading-relaxed font-normal">
          {t.heroSubheading}
        </p>

        {/* Primary Actions */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              playClickSound();
              onSelectTool('photo-resizer');
            }}
            className="px-6 py-3 rounded-xl bg-[#181A1B] hover:bg-[#2C2F33] active:scale-98 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow"
          >
            <Upload className="w-4 h-4 text-[#C85A17]" />
            <span>{t.btnUploadPhoto}</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onNavigate('exams');
            }}
            className="px-6 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF8F5] active:scale-98 text-[#181A1B] border border-[#D5CFC9] text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <GraduationCap className="w-4 h-4 text-[#1F4E5B]" />
            <span>{t.btnFindExam}</span>
          </button>
        </div>

        {/* Privacy reassurance pill */}
        <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#52796F] font-medium">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>{t.privacyBadge}</span>
        </div>
      </section>

      {/* Verified Exam Quick Selector Bar */}
      <section className="bg-[#FAF8F5] py-5 border-b border-[#EAE3DA] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A8086]">
              Verified Exam Presets:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {VERIFIED_EXAMS.slice(0, 6).map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  playClickSound();
                  onSelectExam(exam.slug);
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E0D9D0] hover:border-[#C85A17] text-xs font-semibold text-[#181A1B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>{exam.shortName}</span>
                <span className="text-[10px] text-[#71767B] font-mono">
                  {exam.photo.minSizeKb}–{exam.photo.maxSizeKb}KB
                </span>
              </button>
            ))}
            <button
              onClick={() => {
                playClickSound();
                onNavigate('exams');
              }}
              className="text-xs font-semibold text-[#C85A17] hover:underline px-2 py-1 cursor-pointer flex items-center gap-0.5"
            >
              All Exams <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Visual Tool Directory (IMMEDIATELY VISIBLE, NO MARKETING FLUFF) */}
      <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181A1B]">
              {t.orChooseTool}
            </h2>
            <p className="text-xs sm:text-sm text-[#6C7278] mt-0.5">
              Select any standalone utility to process files directly.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#181A1B] text-white'
                  : 'bg-white border border-[#E5DFD8] text-[#555A5F] hover:bg-[#F7F4EF]'
              }`}
            >
              All Tools
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#181A1B] text-white'
                    : 'bg-white border border-[#E5DFD8] text-[#555A5F] hover:bg-[#F7F4EF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => {
                playClickSound();
                onSelectTool(tool.slug);
              }}
              className="rounded-xl border border-[#E5DFD8] bg-white p-5 hover:border-[#C85A17] hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF4ED] text-[#C85A17] flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                    {tool.category === 'photo' && <Camera className="w-4 h-4" />}
                    {tool.category === 'signature' && <FileSignature className="w-4 h-4" />}
                    {tool.category === 'pdf' && <FileText className="w-4 h-4" />}
                    {tool.category === 'calculator' && <Calculator className="w-4 h-4" />}
                    {tool.category === 'document' && <Layers className="w-4 h-4" />}
                  </div>

                  {tool.popular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F2EDE8] text-[#555A5F]">
                      Popular
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[#181A1B] group-hover:text-[#C85A17] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-[#6C7278] mt-1 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EBE5] flex items-center justify-between text-xs font-semibold text-[#181A1B] group-hover:text-[#C85A17]">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reserved Sponsor Placement */}
      <div className="px-4 sm:px-6">
        <AdSlot format="banner-horizontal" />
      </div>

      {/* Evergreen Guides Preview Section */}
      <section className="py-12 px-4 sm:px-6 bg-[#FAF8F5] border-t border-[#EAE3DA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181A1B]">
                Essential Preparation Guides
              </h2>
              <p className="text-xs sm:text-sm text-[#6C7278] mt-0.5">
                Practical instructions to avoid common photo rejections and formatting mistakes.
              </p>
            </div>
            <button
              onClick={() => onNavigate('guides')}
              className="text-xs font-semibold text-[#C85A17] hover:underline flex items-center gap-1 cursor-pointer"
            >
              All Guides <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GUIDES.slice(0, 3).map((guide) => (
              <div
                key={guide.id}
                onClick={() => {
                  playClickSound();
                  onSelectGuide(guide.slug);
                }}
                className="p-5 rounded-xl border border-[#E5DFD8] bg-white hover:border-[#C85A17] transition-colors cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#C85A17] uppercase tracking-wide">
                    {guide.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#181A1B] mt-1 group-hover:text-[#C85A17] transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#6C7278] mt-1.5 line-clamp-2">
                    {guide.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EBE5] text-[11px] font-medium text-[#71767B] flex items-center justify-between">
                  <span>{guide.readingTimeMinutes} min read</span>
                  <span className="text-[#181A1B] font-semibold group-hover:text-[#C85A17]">Read →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
