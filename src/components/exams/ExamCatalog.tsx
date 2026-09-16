import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Camera,
  FileSignature,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VERIFIED_EXAMS, getExamBySlug } from '../../data/exams';
import { ExamRequirement } from '../../types';
import { playClickSound } from '../../utils/audio';

interface ExamCatalogProps {
  selectedExamSlug?: string | null;
  onSelectExam: (exam: ExamRequirement) => void;
  onLaunchPhoto: (exam: ExamRequirement) => void;
  onLaunchSignature: (exam: ExamRequirement) => void;
}

export const ExamCatalog: React.FC<ExamCatalogProps> = ({
  selectedExamSlug,
  onSelectExam,
  onLaunchPhoto,
  onLaunchSignature,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeExam, setActiveExam] = useState<ExamRequirement | null>(() => {
    if (selectedExamSlug) {
      return getExamBySlug(selectedExamSlug) || VERIFIED_EXAMS[0];
    }
    return null;
  });

  const categories = ['All', 'Central Government', 'Banking & Insurance', 'State Examinations', 'Entrance Examinations'];

  const filteredExams = useMemo(() => {
    return VERIFIED_EXAMS.filter((e) => {
      const matchCat = categoryFilter === 'All' || e.category === categoryFilter;
      const matchQuery =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.shortName.toLowerCase().includes(search.toLowerCase()) ||
        e.conductingBody.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [search, categoryFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Title */}
      <div className="max-w-3xl mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A17] mb-1">
          <GraduationCap className="w-4 h-4" />
          <span>Verified Exam Specifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
          Official Photo & Signature Rules for Indian Exams
        </h1>
        <p className="text-sm text-[#5C6166] mt-1.5 leading-relaxed">
          Pre-configured workspaces calibrated strictly against official examination notices. Select your exam to automatically apply mandatory dimensions, file size limits, and name/date formatting.
        </p>
      </div>

      {activeExam ? (
        /* Detailed Exam Requirement Spec Sheet */
        <div className="bg-white rounded-2xl border border-[#E5DFD8] p-6 sm:p-8 shadow-xs">
          {/* Top Bar with Back link */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#F0EBE5]">
            <div>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveExam(null);
                }}
                className="text-xs font-semibold text-[#71767B] hover:text-[#181A1B] flex items-center gap-1 mb-2 cursor-pointer"
              >
                ← Back to all examinations
              </button>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#181A1B]">
                  {activeExam.name} ({activeExam.shortName})
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#FAF4ED] text-[#C85A17] text-xs font-bold border border-[#E8DFD3]">
                  {activeExam.category}
                </span>
              </div>
              <p className="text-xs text-[#6C7278] mt-1">
                Conducting Authority: {activeExam.conductingBody}
              </p>
            </div>

            {/* Verification Metadata Box */}
            <div className="rounded-xl bg-[#FAF8F5] border border-[#EBE5DE] p-3 text-right text-xs">
              <div className="flex items-center gap-1.5 justify-end text-[#1E7245] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Official Notice</span>
              </div>
              <div className="text-[11px] text-[#71767B] mt-0.5">
                Last checked: <span className="font-semibold text-[#181A1B]">{activeExam.lastVerifiedDate}</span>
              </div>
              <div className="text-[10px] text-[#8A8F95] mt-0.5 max-w-xs truncate">
                {activeExam.source}
              </div>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            {/* Photo Requirements Card */}
            <div className="rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#181A1B]">
                    <Camera className="w-4 h-4 text-[#C85A17]" />
                    <span>Photograph Requirements</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C85A17]">
                    {activeExam.photo.minSizeKb}–{activeExam.photo.maxSizeKb} KB
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs text-[#3B4045]">
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Dimensions:</span>
                    <span className="font-mono font-bold text-[#181A1B]">
                      {activeExam.photo.widthPx && activeExam.photo.heightPx
                        ? `${activeExam.photo.widthPx} × ${activeExam.photo.heightPx} px`
                        : `${activeExam.photo.minWidthPx}–${activeExam.photo.maxWidthPx} px`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Physical Size / Aspect:</span>
                    <span className="font-medium text-[#181A1B]">
                      {activeExam.photo.physicalDimensions || '3.5 × 4.5 cm (Passport)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">File Format:</span>
                    <span className="font-bold text-[#181A1B]">
                      {activeExam.photo.format.join(', ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Background:</span>
                    <span className="font-medium text-[#181A1B]">
                      {activeExam.photo.background}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Name & Date of Photo:</span>
                    <span
                      className={`font-semibold ${
                        activeExam.photo.requiresNameAndDate
                          ? 'text-[#C84125]'
                          : 'text-[#5C6166]'
                      }`}
                    >
                      {activeExam.photo.requiresNameAndDate
                        ? 'Mandatory (Candidate Name + D.O.P)'
                        : 'Not Required'}
                    </span>
                  </div>
                </div>

                {activeExam.photo.notes && (
                  <div className="mt-4 p-2.5 rounded bg-white border border-[#EAE3DA] text-[11px] text-[#5C6166]">
                    <span className="font-semibold text-[#181A1B]">Official Note:</span>{' '}
                    {activeExam.photo.notes}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE3DA]">
                <button
                  onClick={() => {
                    playClickSound();
                    onLaunchPhoto(activeExam);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Prepare {activeExam.shortName} Photo Now</span>
                </button>
              </div>
            </div>

            {/* Signature Requirements Card */}
            <div className="rounded-xl border border-[#EAE3DA] bg-[#FAF8F5] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3DA]">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#181A1B]">
                    <FileSignature className="w-4 h-4 text-[#1F4E5B]" />
                    <span>Signature Requirements</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#1F4E5B]">
                    {activeExam.signature.minSizeKb}–{activeExam.signature.maxSizeKb} KB
                  </span>
                </div>

                <div className="mt-4 space-y-2.5 text-xs text-[#3B4045]">
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Dimensions:</span>
                    <span className="font-mono font-bold text-[#181A1B]">
                      {activeExam.signature.widthPx && activeExam.signature.heightPx
                        ? `${activeExam.signature.widthPx} × ${activeExam.signature.heightPx} px`
                        : `${activeExam.signature.minWidthPx}–${activeExam.signature.maxWidthPx} px`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Ink Color:</span>
                    <span className="font-bold text-[#181A1B]">
                      {activeExam.signature.inkColor}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">Background:</span>
                    <span className="font-medium text-[#181A1B]">
                      {activeExam.signature.background}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71767B]">File Format:</span>
                    <span className="font-bold text-[#181A1B]">
                      {activeExam.signature.format.join(', ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {activeExam.signature.notes && (
                  <div className="mt-4 p-2.5 rounded bg-white border border-[#EAE3DA] text-[11px] text-[#5C6166]">
                    <span className="font-semibold text-[#181A1B]">Official Note:</span>{' '}
                    {activeExam.signature.notes}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#EAE3DA]">
                <button
                  onClick={() => {
                    playClickSound();
                    onLaunchSignature(activeExam);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Prepare {activeExam.shortName} Signature Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Thumb Impression / Certificates needed if present */}
          {activeExam.thumbImpression && (
            <div className="mt-6 p-4 rounded-xl border border-[#E5DFD8] bg-[#FAF8F5] text-xs">
              <div className="font-bold text-sm text-[#181A1B] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C85A17]" />
                <span>Left Hand Thumb Impression (LTI) Rules</span>
              </div>
              <p className="text-[#5C6166]">
                Size: {activeExam.thumbImpression.minSizeKb}–{activeExam.thumbImpression.maxSizeKb} KB •{' '}
                {activeExam.thumbImpression.inkColor} on clean white unlined paper.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Catalog Directory Grid */
        <div>
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8F95]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by exam (e.g. UPSC, SSC CGL, IBPS PO, NEET, UP PET)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5CFC9] bg-white text-xs font-medium text-[#181A1B] focus:border-[#C85A17] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[#181A1B] text-white'
                      : 'bg-white border border-[#E5DFD8] text-[#4A4F54] hover:bg-[#F7F4EF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => {
                  playClickSound();
                  setActiveExam(exam);
                  onSelectExam(exam);
                }}
                className="rounded-xl border border-[#E5DFD8] bg-white p-5 hover:border-[#C85A17] hover:shadow-sm transition-all duration-150 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-[#C85A17] uppercase tracking-wide">
                      {exam.category}
                    </span>
                    <span className="text-[10px] text-[#71767B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE5DE]">
                      {exam.lastVerifiedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#181A1B] group-hover:text-[#C85A17] transition-colors">
                    {exam.name} ({exam.shortName})
                  </h3>
                  <p className="text-xs text-[#71767B] mt-0.5 line-clamp-1">
                    {exam.conductingBody}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#F0EBE5]">
                    <div>
                      <div className="text-[10px] text-[#71767B] uppercase">Photo</div>
                      <div className="font-mono font-bold text-[#181A1B] mt-0.5">
                        {exam.photo.minSizeKb}–{exam.photo.maxSizeKb} KB
                      </div>
                      <div className="text-[11px] text-[#6C7278]">
                        {exam.photo.widthPx ? `${exam.photo.widthPx}×${exam.photo.heightPx} px` : '3.5×4.5 cm'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#71767B] uppercase">Signature</div>
                      <div className="font-mono font-bold text-[#181A1B] mt-0.5">
                        {exam.signature.minSizeKb}–{exam.signature.maxSizeKb} KB
                      </div>
                      <div className="text-[11px] text-[#6C7278]">
                        {exam.signature.inkColor}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE5] flex items-center justify-between text-xs font-semibold text-[#181A1B] group-hover:text-[#C85A17]">
                  <span>Configure Workspace</span>
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
