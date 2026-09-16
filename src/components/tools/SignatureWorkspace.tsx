import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Scissors,
  Sparkles,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Check,
  FileSignature
} from 'lucide-react';
import {
  loadImage,
  renderProcessedCanvas,
  compressCanvasToTarget,
  canvasToBlob,
  autoTrimSignature,
  cleanSignatureBackground,
  downloadFile,
  formatBytes,
  CropRect
} from '../../utils/imageProcessing';
import {
  playUploadSound,
  playSuccessSound,
  playDownloadSound,
  playWarningSound
} from '../../utils/audio';
import { SuccessAnimation } from '../common/SuccessAnimation';
import { ValidationBadge } from '../common/ValidationBadge';
import { ExamRequirement, ValidationResult } from '../../types';
import { getToolBySlug } from '../../data/tools';

interface SignatureWorkspaceProps {
  examPreset?: ExamRequirement | null;
  initialToolSlug?: string;
  onNavigateTool?: (slug: string) => void;
  onNavigateExam?: (slug: string) => void;
}

export const SignatureWorkspace: React.FC<SignatureWorkspaceProps> = ({
  examPreset,
  initialToolSlug = 'signature-resizer',
  onNavigateTool,
  onNavigateExam,
}) => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Dimensions & Crop
  const [width, setWidth] = useState<number>(140);
  const [height, setHeight] = useState<number>(60);
  const [currentCrop, setCurrentCrop] = useState<CropRect | undefined>(undefined);

  // Filters
  const [cleanBgMode, setCleanBgMode] = useState<'original' | 'pure-white' | 'transparent'>('pure-white');
  const [targetKb, setTargetKb] = useState<number>(15); // standard 10-20 KB
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');

  // Previews & States
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);
  const [trimmedNotice, setTrimmedNotice] = useState<boolean>(false);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If exam preset present
  useEffect(() => {
    if (examPreset) {
      const s = examPreset.signature;
      if (s.widthPx && s.heightPx) {
        setWidth(s.widthPx);
        setHeight(s.heightPx);
      } else if (s.minWidthPx && s.minHeightPx) {
        setWidth(s.minWidthPx);
        setHeight(s.minHeightPx);
      }
      const safeTarget = Math.round((s.minSizeKb + s.maxSizeKb) / 2);
      setTargetKb(safeTarget);
      setOutputFormat('image/jpeg');
    }
  }, [examPreset]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG).');
      return;
    }

    try {
      setIsProcessing(true);
      const img = await loadImage(file);
      setSourceImage(img);
      setOriginalFile(file);
      setOriginalSize(file.size);
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setCurrentCrop(undefined);

      // Auto examine whitespace
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      const tCtx = tempCanvas.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(img, 0, 0);
        const trimRes = autoTrimSignature(tempCanvas);
        if (trimRes.hasInk) {
          setCurrentCrop(trimRes.crop);
          setTrimmedNotice(true);
        }
      }

      playUploadSound();
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 3000);
    } catch (err) {
      console.error(err);
      playWarningSound();
      alert('Could not decode image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processSignature = useCallback(async () => {
    if (!sourceImage) return;

    try {
      setIsProcessing(true);

      // 1. Render scaled/cropped canvas
      const rawCanvas = await renderProcessedCanvas({
        image: sourceImage,
        targetWidth: width,
        targetHeight: height,
        crop: currentCrop,
        backgroundColor: cleanBgMode === 'transparent' ? 'transparent' : 'white',
      });

      // 2. Apply background cleaning / ink contrast enhancement
      let cleanedCanvas = rawCanvas;
      if (cleanBgMode !== 'original') {
        cleanedCanvas = cleanSignatureBackground(rawCanvas, cleanBgMode);
      }

      // 3. Compress to target KB
      const result = await compressCanvasToTarget(
        cleanedCanvas,
        targetKb,
        cleanBgMode === 'transparent' ? 'image/png' : outputFormat
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newUrl = URL.createObjectURL(result.blob);
      setPreviewUrl(newUrl);
      setResultBlob(result.blob);
      setResultSizeKb(result.fileSizeKb);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, width, height, currentCrop, cleanBgMode, targetKb, outputFormat]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => processSignature(), 100);
      return () => clearTimeout(timer);
    }
  }, [sourceImage, width, height, currentCrop, cleanBgMode, targetKb, outputFormat, processSignature]);

  const handleManualTrim = () => {
    if (!sourceImage) return;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sourceImage.naturalWidth;
    tempCanvas.height = sourceImage.naturalHeight;
    const ctx = tempCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(sourceImage, 0, 0);
      const res = autoTrimSignature(tempCanvas);
      if (res.hasInk) {
        setCurrentCrop(res.crop);
        setTrimmedNotice(true);
        playSuccessSound();
      } else {
        alert('Could not detect ink strokes clearly. Adjust lighting or contrast.');
      }
    }
  };

  const handleResetCrop = () => {
    setCurrentCrop(undefined);
    setTrimmedNotice(false);
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const ext = cleanBgMode === 'transparent' ? 'png' : 'jpg';
    const prefix = examPreset ? `${examPreset.slug}-signature` : 'signature';
    downloadFile(resultBlob, `${prefix}-${width}x${height}-${resultSizeKb}kb.${ext}`);
    playDownloadSound();
    setDownloadCompleted(true);
  };

  // Validation
  const validationResult: ValidationResult = React.useMemo(() => {
    if (!examPreset) return { valid: true, checks: [] };
    const s = examPreset.signature;
    const isSizeOk = resultSizeKb >= s.minSizeKb && resultSizeKb <= s.maxSizeKb;
    const isFormatOk = outputFormat === 'image/jpeg' || cleanBgMode === 'transparent';

    let isDimOk = true;
    let expectedDim = '';
    if (s.widthPx && s.heightPx) {
      isDimOk = width === s.widthPx && height === s.heightPx;
      expectedDim = `${s.widthPx} × ${s.heightPx} px`;
    } else {
      expectedDim = `${s.minWidthPx || 140} × ${s.minHeightPx || 60} px`;
    }

    return {
      valid: isSizeOk && isDimOk,
      checks: [
        {
          id: 'size',
          label: `File size (${s.minSizeKb}–${s.maxSizeKb} KB)`,
          passed: isSizeOk,
          currentValue: `${resultSizeKb} KB`,
          expectedValue: `${s.minSizeKb}–${s.maxSizeKb} KB`,
          fixable: true,
        },
        {
          id: 'dims',
          label: 'Dimensions',
          passed: isDimOk,
          currentValue: `${width} × ${height} px`,
          expectedValue: expectedDim,
          fixable: true,
        },
      ],
    };
  }, [examPreset, resultSizeKb, width, height, outputFormat, cleanBgMode]);

  const handleAutoFix = () => {
    if (!examPreset) return;
    const s = examPreset.signature;
    if (s.widthPx && s.heightPx) {
      setWidth(s.widthPx);
      setHeight(s.heightPx);
    }
    const safeTarget = Math.round((s.minSizeKb + s.maxSizeKb) / 2);
    setTargetKb(safeTarget);
    setCleanBgMode('pure-white');
    setOutputFormat('image/jpeg');
    playSuccessSound();
  };

  const relatedTools = [
    getToolBySlug('photo-resizer'),
    getToolBySlug('signature-compressor'),
    getToolBySlug('jpg-to-pdf'),
  ].filter(Boolean);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {examPreset && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C4A1A] uppercase tracking-wide">
              <span>Exam Signature Mode</span>
              <span>•</span>
              <span>{examPreset.category}</span>
            </div>
            <h2 className="text-base font-bold text-[#181A1B] mt-0.5">
              {examPreset.name} – Signature Requirements
            </h2>
            <p className="text-xs text-[#5C6166]">
              Target: {examPreset.signature.minSizeKb}–{examPreset.signature.maxSizeKb} KB • Black ink on white background.
            </p>
          </div>
        </div>
      )}

      {!sourceImage ? (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
              {examPreset ? `Prepare Signature for ${examPreset.shortName}` : 'Signature Resizer & Background Cleaner'}
            </h1>
            <p className="text-sm text-[#61666B] mt-1.5">
              Clean paper shadows, auto-trim whitespace, and resize to exact government portal requirements.
            </p>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-[#DED7CE] hover:border-[#C85A17] bg-[#FFFFFF] p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-full bg-[#FAF5EE] text-[#C85A17] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <FileSignature className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#181A1B]">
              Upload signature photo or scan
            </h3>
            <p className="text-xs text-[#71767B] mt-1">
              Supports JPG & PNG from camera or document scanner
            </p>

            <div className="mt-6 pt-5 border-t border-[#F2ECE6] flex items-center justify-center gap-2 text-xs text-[#52796F] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Processed 100% on your device. Never saved or uploaded.</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE5]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#181A1B] uppercase tracking-wider">
                    Signature Preview
                  </span>
                  {showSuccessBadge && (
                    <SuccessAnimation message="Signature loaded" />
                  )}
                </div>

                <button
                  onClick={() => {
                    setSourceImage(null);
                    setPreviewUrl(null);
                  }}
                  className="text-xs text-[#71767B] hover:text-[#181A1B] font-medium px-2 py-1 rounded hover:bg-[#F2ECE6] cursor-pointer"
                >
                  Change Signature
                </button>
              </div>

              {/* Preview canvas */}
              <div className="relative my-4 flex items-center justify-center min-h-[220px] max-h-[300px] bg-[#F7F5F2] rounded-lg overflow-hidden border border-[#EBE5DE] p-6">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Signature Preview"
                    className="max-h-[180px] max-w-full object-contain rounded border border-[#E2DDD7] bg-white shadow-xs"
                  />
                ) : (
                  <div className="text-xs text-[#8A8F95]">Rendering...</div>
                )}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-lg border border-[#ECE6DF]">
                <div>
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    Dimensions
                  </div>
                  <div className="font-mono font-bold text-[#181A1B] mt-0.5">
                    {width} × {height} px
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    File Size
                  </div>
                  <div className="font-mono font-bold text-[#181A1B] mt-0.5">
                    {resultSizeKb} KB
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    Target Limit
                  </div>
                  <div className="text-[11px] font-semibold text-[#1E7245] mt-0.5">
                    ≤ {targetKb} KB
                  </div>
                </div>
              </div>

              {/* Download */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0EBE5]">
                <span className="text-xs text-[#52796F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>On-device signature optimization</span>
                </span>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !resultBlob}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 inline-block mr-1.5" />
                  <span>Download Signature ({resultSizeKb} KB)</span>
                </button>
              </div>
            </div>

            {examPreset && (
              <ValidationBadge
                title={`${examPreset.shortName} SIGNATURE CHECK`}
                result={validationResult}
                onAutoFix={handleAutoFix}
              />
            )}

            {downloadCompleted && (
              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E5DCD0] shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E7245]">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Signature ready for submission!</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onNavigateTool?.('photo-resizer')}
                    className="px-3 py-1.5 rounded-md bg-white border border-[#D5CFC9] text-xs font-medium text-[#181A1B] cursor-pointer"
                  >
                    Resize Photo Next
                  </button>
                  <button
                    onClick={() => onNavigateTool?.('jpg-to-pdf')}
                    className="px-3 py-1.5 rounded-md bg-white border border-[#D5CFC9] text-xs font-medium text-[#181A1B] cursor-pointer"
                  >
                    Certificates to PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Controls */}
          <div className="lg:col-span-5 space-y-4 text-xs">
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FFFFFF] p-5 shadow-xs space-y-5">
              {/* Auto-trim whitespace */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#181A1B]">
                    <Scissors className="w-3.5 h-3.5 text-[#C85A17]" />
                    <span>Auto-Trim Whitespace</span>
                  </div>
                  {currentCrop && (
                    <button
                      onClick={handleResetCrop}
                      className="text-[11px] text-[#71767B] hover:text-[#181A1B] cursor-pointer"
                    >
                      Reset Trim
                    </button>
                  )}
                </div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleManualTrim}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#FAF4ED] hover:bg-[#F2ECE4] border border-[#E8DFD3] text-[#8C4A1A] font-semibold text-xs cursor-pointer transition-colors"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Detect & Auto-Trim Empty Margins</span>
                  </button>
                  {trimmedNotice && (
                    <p className="text-[11px] text-[#2E7D32] mt-1.5 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Empty paper borders trimmed to ink bounds.
                    </p>
                  )}
                </div>
              </div>

              {/* Background Cleaner (Section 12) */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#181A1B]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
                    <span>Background & Ink Cleaning</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setCleanBgMode('pure-white')}
                    className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      cleanBgMode === 'pure-white'
                        ? 'border-[#C85A17] bg-[#FAF4ED] text-[#C85A17] font-semibold'
                        : 'border-[#EAE3DA] bg-white hover:bg-[#FAF8F5] text-[#4A4F54]'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Pure White</div>
                    <div className="text-[10px] opacity-75">Exam Standard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCleanBgMode('transparent')}
                    className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      cleanBgMode === 'transparent'
                        ? 'border-[#C85A17] bg-[#FAF4ED] text-[#C85A17] font-semibold'
                        : 'border-[#EAE3DA] bg-white hover:bg-[#FAF8F5] text-[#4A4F54]'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Transparent</div>
                    <div className="text-[10px] opacity-75">PNG Cutout</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCleanBgMode('original')}
                    className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      cleanBgMode === 'original'
                        ? 'border-[#C85A17] bg-[#FAF4ED] text-[#C85A17] font-semibold'
                        : 'border-[#EAE3DA] bg-white hover:bg-[#FAF8F5] text-[#4A4F54]'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Original</div>
                    <div className="text-[10px] opacity-75">No Filter</div>
                  </button>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                    Dimensions
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Math.max(40, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] font-mono font-semibold text-xs text-[#181A1B]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Math.max(20, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] font-mono font-semibold text-xs text-[#181A1B]"
                    />
                  </div>
                </div>

                <div className="flex gap-1.5 mt-2.5">
                  <button
                    onClick={() => {
                      setWidth(140);
                      setHeight(60);
                    }}
                    className="px-2 py-1 rounded bg-[#F2ECE6] text-[#4A4F54] text-[11px] hover:bg-[#EAE4DD] cursor-pointer"
                  >
                    140 × 60 (SSC / IBPS)
                  </button>
                  <button
                    onClick={() => {
                      setWidth(350);
                      setHeight(350);
                    }}
                    className="px-2 py-1 rounded bg-[#F2ECE6] text-[#4A4F54] text-[11px] hover:bg-[#EAE4DD] cursor-pointer"
                  >
                    350 × 350 (UPSC)
                  </button>
                </div>
              </div>

              {/* Target File Size */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                    Target File Size (KB)
                  </span>
                  <span className="font-mono font-bold text-[#181A1B]">{targetKb} KB</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {[10, 15, 20, 30, 50].map((kb) => (
                    <button
                      key={kb}
                      onClick={() => setTargetKb(kb)}
                      className={`px-3 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        targetKb === kb
                          ? 'bg-[#C85A17] text-white font-semibold'
                          : 'bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A4F54] hover:bg-[#F2ECE4]'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FAF8F5] p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8086] mb-2">
                You may also need
              </div>
              <div className="space-y-1.5">
                {relatedTools.map((t) => (
                  <button
                    key={t?.id}
                    onClick={() => onNavigateTool?.(t!.slug)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-[#F2ECE6] border border-[#EBE5DE] transition-colors cursor-pointer text-left"
                  >
                    <span className="font-semibold text-[#181A1B]">{t?.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C85A17]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
