import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Heart
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C85A17] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy & Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
          About ToolCool / ExamReady
        </h1>
        <p className="text-sm text-[#5C6166] mt-2 leading-relaxed">
          ExamReady was created to solve one of the most frustrating bottlenecks in competitive examinations: rejected application forms due to slight photo framing, signature dimension, or file size discrepancies.
        </p>
      </div>

      <div className="space-y-6 text-sm text-[#383D42] leading-relaxed">
        {/* Core Architecture Promise */}
        <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE3DA]">
          <h2 className="text-base font-bold text-[#181A1B] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2E7D32]" />
            <span>100% Client-Side On-Device Processing</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#555A5F]">
            Unlike traditional file converter websites that send your personal identity documents, admit cards, and signatures to remote cloud servers for processing, <strong>ToolCool processes everything locally in your web browser</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD8]">
              <div className="font-bold text-[#181A1B]">No Server Uploads</div>
              <div className="text-[11px] text-[#71767B] mt-0.5">Images and PDFs never leave your laptop or phone.</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD8]">
              <div className="font-bold text-[#181A1B]">Zero Data Storage</div>
              <div className="text-[11px] text-[#71767B] mt-0.5">Nothing is stored in any database or remote cache.</div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5DFD8]">
              <div className="font-bold text-[#181A1B]">Instant Speeds</div>
              <div className="text-[11px] text-[#71767B] mt-0.5">Fast transformations without network upload delays.</div>
            </div>
          </div>
        </div>

        {/* Technical Engine Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD8] shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#C85A17]" />
            <span>Under The Hood: The Technical Engine</span>
          </h2>
          <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#4A4F54]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <span>
                <strong>Smart Binary Search Compressor:</strong> Custom iterative quantization algorithm that targets precise file size limits (e.g. exactly under 50 KB or 20 KB) without degrading facial features.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <span>
                <strong>HTML5 2D Canvas Engine:</strong> Sub-pixel scaling, Lanczos downsampling, and luminance thresholding for cleaning shadowy mobile camera scans into clean white backgrounds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
              <span>
                <strong>PDF-Lib In-Memory Pipeline:</strong> Direct client-side assembly of PDF documents, combining multi-page certificates and rotating admit cards without third-party server binaries.
              </span>
            </li>
          </ul>
        </div>

        {/* Official Disclaimer */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD8] shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C85A17]" />
            <span>Independent Utility Disclaimer</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#555A5F] leading-relaxed">
            ToolCool / ExamReady is an independent utility platform designed to assist applicants. It is neither affiliated with nor endorsed by the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Institute of Banking Personnel Selection (IBPS), National Testing Agency (NTA), Railway Recruitment Boards (RRB), or any State Public Service Commission. All portal requirements, dimensions, and limits are curated and maintained by cross-referencing public exam notifications.
          </p>
        </div>
      </div>
    </div>
  );
};
