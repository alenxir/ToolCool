import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ArrowRight,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  GraduationCap
} from 'lucide-react';
import { GUIDES, getGuideBySlug } from '../../data/guides';
import { GuideItem } from '../../types';
import { getToolBySlug } from '../../data/tools';
import { getExamBySlug } from '../../data/exams';
import { AdSlot } from '../common/AdSlot';
import { playClickSound } from '../../utils/audio';

interface GuideViewerProps {
  selectedGuideSlug?: string | null;
  onNavigateTool?: (slug: string) => void;
  onNavigateExam?: (slug: string) => void;
}

export const GuideViewer: React.FC<GuideViewerProps> = ({
  selectedGuideSlug,
  onNavigateTool,
  onNavigateExam,
}) => {
  const [activeGuide, setActiveGuide] = useState<GuideItem | null>(() => {
    if (selectedGuideSlug) {
      return getGuideBySlug(selectedGuideSlug) || GUIDES[0];
    }
    return null;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {activeGuide ? (
        /* Full Guide Article */
        <article className="bg-white rounded-2xl border border-[#E5DFD8] p-6 sm:p-10 shadow-xs">
          <button
            onClick={() => {
              playClickSound();
              setActiveGuide(null);
            }}
            className="text-xs font-semibold text-[#71767B] hover:text-[#181A1B] flex items-center gap-1 mb-6 cursor-pointer"
          >
            ← Back to all application guides
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A17] mb-2">
            <span>{activeGuide.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#71767B] font-medium lowercase">
              <Clock className="w-3.5 h-3.5" />
              {activeGuide.readingTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
            {activeGuide.title}
          </h1>

          <p className="text-sm text-[#5C6166] mt-3 leading-relaxed pb-6 border-b border-[#F0EBE5]">
            {activeGuide.summary}
          </p>

          {/* Guide Sections */}
          <div className="my-8 space-y-8 text-sm text-[#2D3136] leading-relaxed">
            {activeGuide.sections.map((sec, idx) => (
              <section key={idx} className="space-y-3">
                <h2 className="text-lg font-bold text-[#181A1B]">
                  {sec.heading}
                </h2>
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-[#3F444A]">
                    {p}
                  </p>
                ))}

                {sec.tips && sec.tips.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-2 mt-4 text-xs">
                    <div className="font-bold text-[#8C4A1A] uppercase tracking-wider text-[11px]">
                      Practical Tip
                    </div>
                    {sec.tips.map((t, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-[#4A4F54]">
                        <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Inline Sponsor Placement */}
          <AdSlot format="inline-guide" />

          {/* Related Tools to Launch */}
          {activeGuide.relatedToolSlugs && activeGuide.relatedToolSlugs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#F0EBE5]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#71767B] mb-3 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>Launch Recommended Tools</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGuide.relatedToolSlugs.map((slug) => {
                  const t = getToolBySlug(slug);
                  if (!t) return null;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onNavigateTool?.(t.slug)}
                      className="p-3 rounded-xl border border-[#EAE4DD] bg-[#FAF8F5] hover:bg-white hover:border-[#C85A17] text-left transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#181A1B] group-hover:text-[#C85A17]">
                          {t.name}
                        </div>
                        <div className="text-[11px] text-[#71767B] line-clamp-1">{t.description}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#C85A17] shrink-0 ml-2" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 text-[11px] text-[#8C9298] text-right">
            Last updated: {activeGuide.lastUpdated} • Fact-checked against official recruitment notifications
          </div>
        </article>
      ) : (
        /* Guides Directory */
        <div>
          <div className="max-w-3xl mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A17] mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Document Standards & Education</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
              Application Document Preparation Guides
            </h1>
            <p className="text-sm text-[#5C6166] mt-1.5">
              Clear, practical advice to help you prepare flawless photos, signatures, and PDFs that pass government computer verification on the first attempt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GUIDES.map((guide) => (
              <div
                key={guide.id}
                onClick={() => {
                  playClickSound();
                  setActiveGuide(guide);
                }}
                className="rounded-xl border border-[#E5DFD8] bg-white p-5 hover:border-[#C85A17] hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#71767B] mb-2">
                    <span className="font-semibold text-[#C85A17] uppercase tracking-wide">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#181A1B] group-hover:text-[#C85A17] transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-[#5C6166] mt-1.5 line-clamp-2 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE5] flex items-center justify-between text-xs font-semibold text-[#181A1B] group-hover:text-[#C85A17]">
                  <span>Read Complete Guide</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
