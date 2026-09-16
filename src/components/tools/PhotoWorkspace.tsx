import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  RotateCw,
  Lock,
  Unlock,
  Sliders,
  Crop,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Maximize2,
  ZoomIn,
  Check,
  Wand2
} from 'lucide-react';
import {
  loadImage,
  renderProcessedCanvas,
  compressCanvasToTarget,
  canvasToBlob,
  downloadFile,
  formatBytes,
  CropRect,
  NameDateConfig,
  CompressResult
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

interface PhotoWorkspaceProps {
  examPreset?: ExamRequirement | null;
  initialToolSlug?: string;
  onNavigateTool?: (slug: string) => void;
  onNavigateExam?: (slug: string) => void;
}

export const PhotoWorkspace: React.FC<PhotoWorkspaceProps> = ({
  examPreset,
  initialToolSlug = 'photo-resizer',
  onNavigateTool,
  onNavigateExam,
}) => {
  // State
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Controls
  const [width, setWidth] = useState<number>(400);
  const [height, setHeight] = useState<number>(500);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatioValue, setAspectRatioValue] = useState<number>(400 / 500);

  const [cropPreset, setCropPreset] = useState<'free' | '1:1' | '3:4' | '4:3' | 'passport'>('passport');
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);

  // Format & Quality
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(85);
  const [targetSizeEnabled, setTargetSizeEnabled] = useState<boolean>(true);
  const [targetKb, setTargetKb] = useState<number>(50);

  // Background
  const [bgColor, setBgColor] = useState<string>('original');

  // Name & Date
  const [nameDate, setNameDate] = useState<NameDateConfig>({
    enabled: false,
    name: '',
    date: new Date().toLocaleDateString('en-GB'),
    preset: 'official',
    position: 'bottom-center',
    fontSize: 18,
    fontFamily: 'sans-serif',
  });

  // Processing Results & Previews
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultSizeKb, setResultSizeKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);
  const [downloadCompleted, setDownloadCompleted] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasPreviewRef = useRef<HTMLCanvasElement>(null);

  // If examPreset is provided, initialize dimensions and target KB to match verified requirements
  useEffect(() => {
    if (examPreset) {
      const p = examPreset.photo;
      if (p.widthPx && p.heightPx) {
        setWidth(p.widthPx);
        setHeight(p.heightPx);
        setAspectRatioValue(p.widthPx / p.heightPx);
      } else if (p.minWidthPx && p.minHeightPx) {
        const defaultW = Math.min(p.maxWidthPx || 500, Math.max(p.minWidthPx, 400));
        const defaultH = Math.min(p.maxHeightPx || 600, Math.max(p.minHeightPx, 500));
        setWidth(defaultW);
        setHeight(defaultH);
        setAspectRatioValue(defaultW / defaultH);
      }
      setTargetSizeEnabled(true);
      // Pick a safe middle target size
      const safeTarget = Math.round((p.minSizeKb + p.maxSizeKb) / 2);
      setTargetKb(safeTarget);
      setOutputFormat('image/jpeg');

      if (p.requiresNameAndDate) {
        setNameDate((prev) => ({ ...prev, enabled: true, preset: 'official' }));
      }
    }
  }, [examPreset]);

  // Handle file drop/upload
  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setIsProcessing(true);
      const img = await loadImage(file);
      setSourceImage(img);
      setOriginalFile(file);
      setOriginalSize(file.size);
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });

      // If no exam preset, set initial dimensions
      if (!examPreset) {
        const initialW = img.naturalWidth > 1200 ? 800 : img.naturalWidth;
        const initialH = Math.round(initialW * (img.naturalHeight / img.naturalWidth));
        setWidth(initialW);
        setHeight(initialH);
        setAspectRatioValue(img.naturalWidth / img.naturalHeight);
      }

      playUploadSound();
      setShowSuccessBadge(true);
      setTimeout(() => setShowSuccessBadge(false), 3500);
    } catch (err) {
      console.error(err);
      playWarningSound();
      alert('Could not open image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-render and compress whenever inputs change
  const processImage = useCallback(async () => {
    if (!sourceImage) return;

    try {
      setIsProcessing(true);

      // Render base transformed canvas
      const renderedCanvas = await renderProcessedCanvas({
        image: sourceImage,
        targetWidth: width,
        targetHeight: height,
        rotation,
        backgroundColor: bgColor,
        nameDate,
      });

      let finalBlob: Blob;
      let finalSizeKb: number;

      if (targetSizeEnabled && targetKb > 0) {
        // Compress using binary search
        const result: CompressResult = await compressCanvasToTarget(
          renderedCanvas,
          targetKb,
          outputFormat
        );
        finalBlob = result.blob;
        finalSizeKb = result.fileSizeKb;
      } else {
        finalBlob = await canvasToBlob(renderedCanvas, outputFormat, quality / 100);
        finalSizeKb = Math.round(finalBlob.size / 1024);
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newUrl = URL.createObjectURL(finalBlob);
      setPreviewUrl(newUrl);
      setResultBlob(finalBlob);
      setResultSizeKb(finalSizeKb);
    } catch (err) {
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImage, width, height, rotation, bgColor, nameDate, targetSizeEnabled, targetKb, outputFormat, quality]);

  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        processImage();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [sourceImage, width, height, rotation, bgColor, nameDate, targetSizeEnabled, targetKb, outputFormat, quality, processImage]);

  // Dimension helpers
  const handleWidthChange = (newWidth: number) => {
    const w = Math.max(20, Math.round(newWidth));
    setWidth(w);
    if (lockAspectRatio && aspectRatioValue > 0) {
      setHeight(Math.max(20, Math.round(w / aspectRatioValue)));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    const h = Math.max(20, Math.round(newHeight));
    setHeight(h);
    if (lockAspectRatio && aspectRatioValue > 0) {
      setWidth(Math.max(20, Math.round(h * aspectRatioValue)));
    }
  };

  const applyCropPreset = (preset: 'free' | '1:1' | '3:4' | '4:3' | 'passport') => {
    setCropPreset(preset);
    let ratio = 1;
    if (preset === '1:1') ratio = 1;
    else if (preset === '3:4') ratio = 3 / 4;
    else if (preset === '4:3') ratio = 4 / 3;
    else if (preset === 'passport') ratio = 3.5 / 4.5;

    if (preset !== 'free') {
      setAspectRatioValue(ratio);
      setLockAspectRatio(true);
      setHeight(Math.round(width / ratio));
    }
  };

  // Download action
  const handleDownload = () => {
    if (!resultBlob) return;
    const ext = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';
    const prefix = examPreset ? `${examPreset.slug}-photo` : 'toolcool-photo';
    const filename = `${prefix}-${width}x${height}-${resultSizeKb}kb.${ext}`;

    downloadFile(resultBlob, filename);
    playDownloadSound();
    setDownloadCompleted(true);
  };

  // Exam Validation result computation
  const validationResult: ValidationResult = React.useMemo(() => {
    if (!examPreset) {
      return { valid: true, checks: [] };
    }

    const p = examPreset.photo;
    const isFormatOk = outputFormat === 'image/jpeg';
    const isSizeOk = resultSizeKb >= p.minSizeKb && resultSizeKb <= p.maxSizeKb;

    let isDimOk = true;
    let expectedDimStr = '';
    if (p.widthPx && p.heightPx) {
      isDimOk = width === p.widthPx && height === p.heightPx;
      expectedDimStr = `${p.widthPx} × ${p.heightPx} px`;
    } else {
      if (p.minWidthPx && width < p.minWidthPx) isDimOk = false;
      if (p.maxWidthPx && width > p.maxWidthPx) isDimOk = false;
      if (p.minHeightPx && height < p.minHeightPx) isDimOk = false;
      if (p.maxHeightPx && height > p.maxHeightPx) isDimOk = false;
      expectedDimStr = `${p.minWidthPx || 350}–${p.maxWidthPx || 1000} px`;
    }

    const checks = [
      {
        id: 'format',
        label: 'File format (.jpg/.jpeg)',
        passed: isFormatOk,
        currentValue: outputFormat.replace('image/', '').toUpperCase(),
        expectedValue: 'JPG',
        fixable: true,
      },
      {
        id: 'dimensions',
        label: 'Pixel dimensions',
        passed: isDimOk,
        currentValue: `${width} × ${height} px`,
        expectedValue: expectedDimStr,
        fixable: true,
      },
      {
        id: 'filesize',
        label: `File size (${p.minSizeKb}–${p.maxSizeKb} KB)`,
        passed: isSizeOk,
        currentValue: `${resultSizeKb} KB`,
        expectedValue: `${p.minSizeKb}–${p.maxSizeKb} KB`,
        fixable: true,
      },
    ];

    return {
      valid: isFormatOk && isDimOk && isSizeOk,
      checks,
    };
  }, [examPreset, outputFormat, width, height, resultSizeKb]);

  // Auto-fix according to exam specs
  const handleAutoFix = () => {
    if (!examPreset) return;
    const p = examPreset.photo;

    // Fix format
    setOutputFormat('image/jpeg');

    // Fix dimensions
    if (p.widthPx && p.heightPx) {
      setWidth(p.widthPx);
      setHeight(p.heightPx);
      setAspectRatioValue(p.widthPx / p.heightPx);
    } else if (p.minWidthPx && p.minHeightPx) {
      const idealW = Math.max(p.minWidthPx, 400);
      const idealH = Math.max(p.minHeightPx, 500);
      setWidth(idealW);
      setHeight(idealH);
      setAspectRatioValue(idealW / idealH);
    }

    // Fix file size
    setTargetSizeEnabled(true);
    const target = Math.round((p.minSizeKb + p.maxSizeKb) / 2);
    setTargetKb(target);

    // If Name/Date mandated
    if (p.requiresNameAndDate && !nameDate.enabled) {
      setNameDate((prev) => ({ ...prev, enabled: true, preset: 'official' }));
    }

    playSuccessSound();
  };

  // Recommended related tools
  const currentTool = getToolBySlug(initialToolSlug) || getToolBySlug('photo-resizer');
  const relatedTools = (currentTool?.recommendedNext || ['image-compressor', 'signature-resizer', 'add-name-date', 'jpg-to-pdf'])
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Exam Context Banner if Exam Mode */}
      {examPreset && (
        <div className="mb-6 p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8C4A1A] uppercase tracking-wide">
              <span>Exam Mode</span>
              <span>•</span>
              <span>{examPreset.category}</span>
            </div>
            <h2 className="text-base font-bold text-[#181A1B] mt-0.5">
              {examPreset.name} – Official Photo Requirements
            </h2>
            <p className="text-xs text-[#5C6166] mt-0.5">
              Requirements last verified: <span className="font-semibold">{examPreset.lastVerifiedDate}</span> ({examPreset.source})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateExam?.(examPreset.slug)}
              className="text-xs font-medium text-[#7A5030] hover:text-[#181A1B] px-3 py-1.5 rounded-lg border border-[#DACDC0] bg-white cursor-pointer transition-colors"
            >
              View Full Exam Rules
            </button>
          </div>
        </div>
      )}

      {/* Initial Empty Upload State */}
      {!sourceImage ? (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
              {examPreset ? `Prepare Photo for ${examPreset.shortName}` : 'Photo Resizer & Smart Compressor'}
            </h1>
            <p className="text-sm text-[#61666B] mt-1.5">
              Resize to exact pixel/cm dimensions, compress to target file size, and format with zero cloud upload.
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
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-full bg-[#FAF5EE] text-[#C85A17] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
              <Upload className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#181A1B]">
              Drop your image here
            </h3>
            <p className="text-xs text-[#71767B] mt-1">
              or click to browse from device
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-1 rounded bg-[#F2EDE8] text-[#555A5F] text-[11px] font-medium">
                JPG
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F2EDE8] text-[#555A5F] text-[11px] font-medium">
                PNG
              </span>
              <span className="px-2.5 py-1 rounded bg-[#F2EDE8] text-[#555A5F] text-[11px] font-medium">
                WEBP
              </span>
              <span className="text-[11px] text-[#8A8F95] ml-2">Up to 25 MB</span>
            </div>

            <div className="mt-6 pt-5 border-t border-[#F2ECE6] flex items-center justify-center gap-2 text-xs text-[#52796F] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>Processed locally in your browser. 100% on-device privacy.</span>
            </div>
          </div>

          {/* Quick presets list */}
          <div className="mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A8086] mb-3 text-center">
              Popular Dimensions Presets
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl border border-[#E8E2DA] bg-white text-center">
                <div className="font-bold text-[#181A1B]">3.5 × 4.5 cm</div>
                <div className="text-[11px] text-[#71767B]">Passport India / EU</div>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E2DA] bg-white text-center">
                <div className="font-bold text-[#181A1B]">2 × 2 Inches</div>
                <div className="text-[11px] text-[#71767B]">US Visa / OCI</div>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E2DA] bg-white text-center">
                <div className="font-bold text-[#181A1B]">200 × 230 px</div>
                <div className="text-[11px] text-[#71767B]">IBPS / SBI Banking</div>
              </div>
              <div className="p-3 rounded-xl border border-[#E8E2DA] bg-white text-center">
                <div className="font-bold text-[#181A1B]">350 × 350 px</div>
                <div className="text-[11px] text-[#71767B]">UPSC CSE & OTR</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Active Workspace Editor */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Live Preview Canvas & Stats */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FFFFFF] p-4 sm:p-5 shadow-xs">
              {/* Header stats bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EBE5]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#181A1B] uppercase tracking-wider">
                    Preview & Output
                  </span>
                  {showSuccessBadge && (
                    <SuccessAnimation message="Photo loaded successfully" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSourceImage(null);
                      setOriginalFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-xs text-[#71767B] hover:text-[#181A1B] font-medium px-2 py-1 rounded hover:bg-[#F2ECE6] transition-colors cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    title="Rotate 90 degrees"
                    className="p-1.5 rounded-md border border-[#E5DFD8] hover:bg-[#F5F2ED] text-[#3B4045] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Canvas Preview Area */}
              <div className="relative my-4 flex items-center justify-center min-h-[360px] max-h-[500px] bg-[#F7F5F2] rounded-lg overflow-hidden border border-[#EBE5DE] p-4">
                {isProcessing && (
                  <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white shadow-md text-xs font-medium text-[#181A1B]">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C85A17]" />
                      <span>Optimizing photo...</span>
                    </div>
                  </div>
                )}

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Processed Preview"
                    className="max-h-[460px] max-w-full object-contain rounded shadow-xs"
                  />
                ) : (
                  <div className="text-xs text-[#8A8F95]">Rendering preview...</div>
                )}
              </div>

              {/* Live Dimensions & File Size Comparison (Section 7 requirement) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-[#FAF8F5] p-3 rounded-lg border border-[#ECE6DF]">
                <div>
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    Original
                  </div>
                  <div className="font-mono font-medium text-[#181A1B] mt-0.5">
                    {originalDimensions.width} × {originalDimensions.height} px
                  </div>
                  <div className="text-[11px] text-[#71767B]">
                    {formatBytes(originalSize)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    Output
                  </div>
                  <div className="font-mono font-bold text-[#181A1B] mt-0.5">
                    {width} × {height} px
                  </div>
                  <div className="text-[11px] font-semibold text-[#181A1B]">
                    {resultSizeKb} KB ({outputFormat.replace('image/', '').toUpperCase()})
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-[#71767B] uppercase font-semibold">
                    File Size Status
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {targetSizeEnabled && resultSizeKb <= targetKb ? (
                      <span className="text-[#1E7245] font-semibold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Within target (≤{targetKb} KB)
                      </span>
                    ) : targetSizeEnabled ? (
                      <span className="text-[#B83E1C] font-semibold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {resultSizeKb} KB &gt; {targetKb} KB
                      </span>
                    ) : (
                      <span className="text-[#5C6166] text-[11px]">Standard export</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Download CTA Bar */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0EBE5]">
                <div className="text-xs text-[#52796F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Rendered on-device. No data sent to any server.</span>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isProcessing || !resultBlob}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] active:scale-98 text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Photo ({resultSizeKb} KB)</span>
                </button>
              </div>
            </div>

            {/* Exam Validation Panel (if Exam mode is active) */}
            {examPreset && (
              <ValidationBadge
                title={`${examPreset.shortName} PHOTO CHECK`}
                result={validationResult}
                onAutoFix={handleAutoFix}
              />
            )}

            {/* Next Step Suggestion if Download completed (Section 18 requirement) */}
            {downloadCompleted && (
              <div className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E5DCD0] shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1E7245]">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Photo downloaded successfully!</span>
                </div>
                <div className="text-xs text-[#5C6166] mt-1">
                  Need to prepare other documents for your application?
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => onNavigateTool?.('signature-resizer')}
                    className="px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#D5CFC9] hover:border-[#181A1B] text-xs font-medium text-[#181A1B] transition-colors cursor-pointer"
                  >
                    Prepare Signature
                  </button>
                  <button
                    onClick={() => onNavigateTool?.('jpg-to-pdf')}
                    className="px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#D5CFC9] hover:border-[#181A1B] text-xs font-medium text-[#181A1B] transition-colors cursor-pointer"
                  >
                    Convert to PDF
                  </button>
                  <button
                    onClick={() => onNavigateTool?.('add-name-date')}
                    className="px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#D5CFC9] hover:border-[#181A1B] text-xs font-medium text-[#181A1B] transition-colors cursor-pointer"
                  >
                    Add Name & Date
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Controls Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FFFFFF] p-5 shadow-xs text-xs space-y-5">
              {/* Dimensions & Aspect Ratio (Section 7) */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                    Dimensions
                  </span>
                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                      lockAspectRatio
                        ? 'bg-[#FAF4ED] text-[#C85A17] border border-[#E8DFD3]'
                        : 'bg-[#F2EDE8] text-[#71767B]'
                    }`}
                  >
                    {lockAspectRatio ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>{lockAspectRatio ? 'Locked' : 'Unlocked'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] text-xs font-mono font-semibold text-[#181A1B] focus:bg-white focus:border-[#C85A17] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] text-xs font-mono font-semibold text-[#181A1B] focus:bg-white focus:border-[#C85A17] outline-none"
                    />
                  </div>
                </div>

                {/* Aspect ratio presets (Section 9) */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-[#71767B] mr-1">Ratios:</span>
                  {(['free', '1:1', '3:4', '4:3', 'passport'] as const).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => applyCropPreset(preset)}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer capitalize ${
                        cropPreset === preset
                          ? 'bg-[#181A1B] text-white'
                          : 'bg-[#F2ECE6] text-[#4A4F54] hover:bg-[#EAE4DD]'
                      }`}
                    >
                      {preset === 'passport' ? 'Passport (3.5:4.5)' : preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target File Size Mode (Section 8) */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                    Smart Target File Size
                  </span>
                  <input
                    type="checkbox"
                    checked={targetSizeEnabled}
                    onChange={(e) => setTargetSizeEnabled(e.target.checked)}
                    className="accent-[#C85A17] cursor-pointer"
                  />
                </div>

                {targetSizeEnabled ? (
                  <div className="mt-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#71767B]">Max Limit:</span>
                      <input
                        type="number"
                        value={targetKb}
                        onChange={(e) => setTargetKb(Math.max(5, Number(e.target.value)))}
                        className="w-24 px-2.5 py-1 rounded border border-[#DCD6CE] bg-[#FAF8F5] font-mono font-bold text-xs text-[#181A1B]"
                      />
                      <span className="text-xs font-medium text-[#71767B]">KB</span>
                    </div>

                    {/* Quick KB presets (Section 8: 20KB, 50KB, 100KB, 200KB, 500KB, 1MB) */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[20, 50, 100, 200, 500, 1000].map((kb) => (
                        <button
                          key={kb}
                          type="button"
                          onClick={() => setTargetKb(kb)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            targetKb === kb
                              ? 'bg-[#C85A17] text-white font-semibold'
                              : 'bg-[#FAF6F0] border border-[#E8E0D5] text-[#4A4F54] hover:bg-[#F2ECE4]'
                          }`}
                        >
                          {kb >= 1000 ? '1 MB' : `${kb} KB`}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-[#71767B] mb-1">
                      <span>Standard Quality Slider</span>
                      <span className="font-mono font-semibold text-[#181A1B]">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[#C85A17] cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Format & Background Color (Section 10) */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                    Format & Background
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] text-xs font-medium text-[#181A1B]"
                    >
                      <option value="image/jpeg">JPG / JPEG (Standard)</option>
                      <option value="image/png">PNG (Lossless)</option>
                      <option value="image/webp">WEBP (Modern)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-[#71767B] block mb-1">
                      Background Color
                    </label>
                    <select
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#DCD6CE] bg-[#FAF8F5] text-xs font-medium text-[#181A1B]"
                    >
                      <option value="original">Original Background</option>
                      <option value="white">Pure White (#FFFFFF)</option>
                      <option value="#F2F2F2">Light Gray (Exam)</option>
                      <option value="#E6F0FA">Light Blue</option>
                      <option value="transparent">Transparent (PNG)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Name and Date to Photo (Section 11) */}
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE5]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C85A17]" />
                    <span className="font-bold uppercase tracking-wider text-[#181A1B]">
                      Add Name & Date (D.O.P)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={nameDate.enabled}
                    onChange={(e) => setNameDate({ ...nameDate, enabled: e.target.checked })}
                    className="accent-[#C85A17] cursor-pointer"
                  />
                </div>

                {nameDate.enabled && (
                  <div className="mt-3 space-y-3 bg-[#FAF8F5] p-3 rounded-lg border border-[#EAE3DA]">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#71767B] block mb-0.5">
                        Candidate Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RAHUL SHARMA"
                        value={nameDate.name}
                        onChange={(e) => setNameDate({ ...nameDate, name: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded border border-[#D5CFC9] bg-white text-xs font-semibold text-[#181A1B]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-[#71767B] block mb-0.5">
                        Date of Photograph (D.O.P)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15/08/2024"
                        value={nameDate.date}
                        onChange={(e) => setNameDate({ ...nameDate, date: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded border border-[#D5CFC9] bg-white text-xs font-mono font-medium text-[#181A1B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] text-[#71767B] block mb-0.5">
                          Style Preset
                        </label>
                        <select
                          value={nameDate.preset}
                          onChange={(e) => setNameDate({ ...nameDate, preset: e.target.value as any })}
                          className="w-full px-2 py-1 rounded border border-[#D5CFC9] bg-white text-[11px]"
                        >
                          <option value="official">Official (White strip + border)</option>
                          <option value="simple">Simple Banner</option>
                          <option value="minimal">Minimal Floating</option>
                          <option value="bold">Bold Badge</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-[#71767B] block mb-0.5">
                          Position
                        </label>
                        <select
                          value={nameDate.position}
                          onChange={(e) => setNameDate({ ...nameDate, position: e.target.value as any })}
                          className="w-full px-2 py-1 rounded border border-[#D5CFC9] bg-white text-[11px]"
                        >
                          <option value="bottom-center">Bottom Center (Standard)</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="top-center">Top Center</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contextual Recommendations (Section 17: "YOU MAY ALSO NEED") */}
            <div className="rounded-xl border border-[#E5DFD8] bg-[#FAF8F5] p-4 text-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#7A8086] mb-2.5">
                You may also need
              </div>
              <div className="space-y-1.5">
                {relatedTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => onNavigateTool?.(tool.slug)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-white hover:bg-[#F2ECE6] border border-[#EBE5DE] transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <div className="font-semibold text-[#181A1B]">{tool.name}</div>
                      <div className="text-[11px] text-[#71767B] line-clamp-1">{tool.description}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C85A17] shrink-0 ml-2" />
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
