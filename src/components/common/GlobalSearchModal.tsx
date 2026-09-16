import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, FileText, Wrench, GraduationCap, CornerDownLeft } from 'lucide-react';
import { ALL_TOOLS } from '../../data/tools';
import { VERIFIED_EXAMS } from '../../data/exams';
import { GUIDES } from '../../data/guides';
import { playClickSound } from '../../utils/audio';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
  onSelectExam: (slug: string) => void;
  onSelectGuide: (slug: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onSelectExam,
  onSelectGuide,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        tools: ALL_TOOLS.filter((t) => t.popular).slice(0, 5),
        exams: VERIFIED_EXAMS.slice(0, 4),
        guides: GUIDES.slice(0, 3),
      };
    }

    const tools = ALL_TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    ).slice(0, 6);

    const exams = VERIFIED_EXAMS.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.shortName.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.conductingBody.toLowerCase().includes(q)
    ).slice(0, 5);

    const guides = GUIDES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.summary.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    ).slice(0, 4);

    return { tools, exams, guides };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#121416]/40 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FFFFFF] rounded-xl border border-[#E5DFD8] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#181A1B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#EBE5DE] px-4 py-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#8A8F95] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all tools, exams (UPSC, SSC, IBPS, NEET), or guides..."
            className="w-full bg-transparent border-none outline-none pl-3 pr-8 text-sm font-medium text-[#181A1B] placeholder-[#8A8F95]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8A8F95] hover:text-[#181A1B] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-xs divide-y divide-[#F2EDE8]">
          {/* Tools */}
          {filtered.tools.length > 0 && (
            <div className="pt-2 first:pt-0">
              <div className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A8086]">
                <Wrench className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>Tools & Utilities ({filtered.tools.length})</span>
              </div>
              <div className="space-y-1">
                {filtered.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      playClickSound();
                      onSelectTool(tool.slug);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F4EF] transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#181A1B] group-hover:text-[#C85A17] transition-colors">
                        {tool.name}
                      </div>
                      <div className="text-xs text-[#6C7278] line-clamp-1">
                        {tool.description}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-[#8A8F95] group-hover:text-[#181A1B] flex items-center gap-1 shrink-0 ml-2">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exams */}
          {filtered.exams.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A8086]">
                <GraduationCap className="w-3.5 h-3.5 text-[#1F4E5B]" />
                <span>Exam Presets ({filtered.exams.length})</span>
              </div>
              <div className="space-y-1">
                {filtered.exams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      playClickSound();
                      onSelectExam(exam.slug);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F4EF] transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#181A1B] group-hover:text-[#1F4E5B] transition-colors">
                          {exam.shortName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-[#EAE5DF] text-[10px] font-semibold text-[#4A4F54]">
                          {exam.category}
                        </span>
                      </div>
                      <div className="text-xs text-[#6C7278] line-clamp-1">
                        {exam.name} • {exam.source}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-[#8A8F95] group-hover:text-[#181A1B] flex items-center gap-1 shrink-0 ml-2">
                      Prepare <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guides */}
          {filtered.guides.length > 0 && (
            <div className="pt-3">
              <div className="flex items-center gap-1.5 px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A8086]">
                <FileText className="w-3.5 h-3.5 text-[#2A4B7C]" />
                <span>Guides & Rules ({filtered.guides.length})</span>
              </div>
              <div className="space-y-1">
                {filtered.guides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => {
                      playClickSound();
                      onSelectGuide(guide.slug);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F7F4EF] transition-colors cursor-pointer text-left group"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#181A1B] group-hover:text-[#2A4B7C] transition-colors">
                        {guide.title}
                      </div>
                      <div className="text-xs text-[#6C7278] line-clamp-1">
                        {guide.summary}
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-[#8A8F95] group-hover:text-[#181A1B] flex items-center gap-1 shrink-0 ml-2">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filtered.tools.length === 0 &&
            filtered.exams.length === 0 &&
            filtered.guides.length === 0 && (
              <div className="py-8 text-center text-[#71767B]">
                <p className="font-medium text-sm">No results found for "{query}"</p>
                <p className="text-xs mt-1">
                  Try searching for "UPSC", "Photo", "Signature", "Crop", or "PDF"
                </p>
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#FAF8F5] border-t border-[#EBE5DE] text-[11px] text-[#7A8086]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-[#D5CFC9] bg-[#FFFFFF] font-mono text-[10px]">
                ESC
              </kbd>{' '}
              to close
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> to select
            </span>
          </div>
          <span className="text-[#8C9298]">100% Client-side privacy guaranteed</span>
        </div>
      </div>
    </div>
  );
};
