import React from 'react';
import { ShieldCheck, Lock, Heart, ArrowUpRight } from 'lucide-react';
import { TOOL_CATEGORIES } from '../../data/tools';
import { VERIFIED_EXAMS } from '../../data/exams';
import { playClickSound } from '../../utils/audio';

interface FooterProps {
  onNavigateTool: (slug: string) => void;
  onNavigateExam: (slug: string) => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTool,
  onNavigateExam,
  onNavigate,
}) => {
  return (
    <footer className="w-full bg-[#181A1B] text-[#A6ABB0] text-xs pt-12 pb-16 border-t border-[#2B2F33] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#2C3035]">
          {/* Col 1: Brand & Security Promise */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C85A17] text-white flex items-center justify-center font-black text-xs">
                TC
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                ToolCool <span className="font-normal text-xs text-[#E89E6C]">/ ExamReady</span>
              </span>
            </div>

            <p className="text-xs text-[#8E949B] leading-relaxed max-w-sm">
              The professional utility suite for preparing photographs, digital signatures, certificates, and PDFs for online government exam portals and job applications.
            </p>

            <div className="p-3.5 rounded-xl bg-[#222528] border border-[#2F343A] space-y-1.5">
              <div className="flex items-center gap-1.5 text-white font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-[#48BB78]" />
                <span>Zero Server Uploads Guaranteed</span>
              </div>
              <p className="text-[11px] text-[#8E949B] leading-normal">
                All document transformations, resizing, compression, and PDF stitching occur strictly inside your device's browser memory. Your biometric photos and signatures never touch an external cloud server.
              </p>
            </div>
          </div>

          {/* Col 2: Photo & Signature Tools */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Photo & Signature
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTool('photo-resizer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Photo Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('signature-resizer')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Signature Resizer & Cleaner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('image-compressor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Target KB Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('add-name-date')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Add Name & Date (D.O.P)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('passport-photo-maker')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Passport Photo Maker
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: PDF & Utilities */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              PDF & Utilities
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTool('merge-pdf')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Merge Multiple PDFs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('split-pdf')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Split / Extract Admit Card
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('jpg-to-pdf')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Scanned Images to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('age-calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Exam Cutoff Age Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTool('dpi-calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  DPI & Unit Converter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Popular Exam Presets */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Exam Specifications
            </h4>
            <ul className="space-y-2">
              {VERIFIED_EXAMS.slice(0, 5).map((exam) => (
                <li key={exam.id}>
                  <button
                    onClick={() => onNavigateExam(exam.slug)}
                    className="hover:text-white transition-colors cursor-pointer text-left truncate block w-full"
                  >
                    {exam.shortName} Rules ({exam.photo.minSizeKb}–{exam.photo.maxSizeKb} KB)
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onNavigate('exams')}
                  className="text-[#E89E6C] hover:underline font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                >
                  All 10+ Exams <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#787E85]">
          <p className="max-w-2xl text-center md:text-left">
            <span className="font-semibold text-[#A6ABB0]">Disclaimer:</span> ToolCool / ExamReady is an independent educational and technical document utility. We are not affiliated with, sponsored by, or endorsed by UPSC, SSC, IBPS, NTA, or any state or central government recruitment commission. All specifications are curated and checked against public notices.
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white cursor-pointer"
            >
              About & Privacy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('guides')}
              className="hover:text-white cursor-pointer"
            >
              Guides
            </button>
            <span>•</span>
            <span>Client-side v2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
