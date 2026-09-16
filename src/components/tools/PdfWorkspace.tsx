import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Layers,
  FileCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import {
  mergePdfFiles,
  splitPdfFile,
  rotatePdfPages,
  imagesToPdf,
  getPdfPageCount
} from '../../utils/pdfProcessing';
import { downloadFile, formatBytes } from '../../utils/imageProcessing';
import {
  playUploadSound,
  playSuccessSound,
  playDownloadSound,
  playWarningSound
} from '../../utils/audio';

interface PdfWorkspaceProps {
  initialSubTool?: 'merge-pdf' | 'split-pdf' | 'compress-pdf' | 'jpg-to-pdf' | 'rotate-pdf';
  onNavigateTool?: (slug: string) => void;
}

export const PdfWorkspace: React.FC<PdfWorkspaceProps> = ({
  initialSubTool = 'merge-pdf',
  onNavigateTool,
}) => {
  const [activeTab, setActiveTab] = useState<'merge-pdf' | 'split-pdf' | 'jpg-to-pdf' | 'rotate-pdf'>(
    initialSubTool === 'compress-pdf' ? 'merge-pdf' : initialSubTool
  );

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<{ file: File; id: string; pages: number }[]>([]);
  // Split state
  const [splitFile, setSplitFile] = useState<{ file: File; pages: number } | null>(null);
  const [pageRange, setPageRange] = useState<string>('1-2');
  // JPG to PDF state
  const [imageFiles, setImageFiles] = useState<{ file: File; id: string; preview: string }[]>([]);
  const [pageOrientation, setPageOrientation] = useState<'portrait' | 'landscape'>('portrait');
  // Rotate state
  const [rotateFile, setRotateFile] = useState<{ file: File; pages: number } | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);

  // Status
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add files to merge
  const handleMergeFilesAdded = async (files: FileList) => {
    try {
      setIsProcessing(true);
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          const pages = await getPdfPageCount(file);
          newItems.push({
            file,
            id: `${file.name}-${Date.now()}-${i}`,
            pages,
          });
        }
      }
      setMergeFiles((prev) => [...prev, ...newItems]);
      playUploadSound();
    } catch (err) {
      console.error(err);
      playWarningSound();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteMerge = async () => {
    if (mergeFiles.length < 2) {
      alert('Please select at least 2 PDF files to merge.');
      return;
    }
    try {
      setIsProcessing(true);
      const mergedBlob = await mergePdfFiles(mergeFiles.map((m) => m.file));
      downloadFile(mergedBlob, `merged-document-${Date.now()}.pdf`);
      playDownloadSound();
      setDownloadSuccess('Merged PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      playWarningSound();
      alert('Failed to merge PDFs. Ensure files are not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add file to Split
  const handleSplitFileAdded = async (file: File) => {
    try {
      setIsProcessing(true);
      const pages = await getPdfPageCount(file);
      setSplitFile({ file, pages });
      setPageRange(`1-${Math.min(pages, 2)}`);
      playUploadSound();
    } catch (err) {
      console.error(err);
      playWarningSound();
      alert('Failed to read PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteSplit = async () => {
    if (!splitFile) return;
    try {
      setIsProcessing(true);
      // parse range
      let targetPages: number[] = [];
      if (pageRange.includes('-')) {
        const [start, end] = pageRange.split('-').map((n) => parseInt(n.trim(), 10));
        if (start && end && start <= end) {
          for (let p = start; p <= end; p++) {
            if (p >= 1 && p <= splitFile.pages) targetPages.push(p);
          }
        }
      } else {
        const nums = pageRange.split(',').map((n) => parseInt(n.trim(), 10));
        targetPages = nums.filter((n) => n >= 1 && n <= splitFile.pages);
      }

      if (targetPages.length === 0) {
        alert(`Invalid page range. Please enter numbers between 1 and ${splitFile.pages}.`);
        return;
      }

      const splitBlob = await splitPdfFile(splitFile.file, targetPages);
      downloadFile(splitBlob, `extracted-pages-${pageRange}.pdf`);
      playDownloadSound();
      setDownloadSuccess(`Pages ${pageRange} extracted and downloaded!`);
    } catch (err) {
      console.error(err);
      playWarningSound();
    } finally {
      setIsProcessing(false);
    }
  };

  // JPG to PDF
  const handleImagesAdded = (files: FileList) => {
    const newImgs = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newImgs.push({
          file,
          id: `${file.name}-${Date.now()}-${i}`,
          preview: URL.createObjectURL(file),
        });
      }
    }
    setImageFiles((prev) => [...prev, ...newImgs]);
    playUploadSound();
  };

  const handleExecuteImagesToPdf = async () => {
    if (imageFiles.length === 0) return;
    try {
      setIsProcessing(true);
      const pdfBlob = await imagesToPdf(
        imageFiles.map((item) => item.file),
        pageOrientation
      );
      downloadFile(pdfBlob, `images-document-${Date.now()}.pdf`);
      playDownloadSound();
      setDownloadSuccess('Images converted into consolidated PDF!');
    } catch (err) {
      console.error(err);
      playWarningSound();
      alert('Error converting images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Rotate PDF
  const handleRotateFileAdded = async (file: File) => {
    try {
      setIsProcessing(true);
      const pages = await getPdfPageCount(file);
      setRotateFile({ file, pages });
      playUploadSound();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteRotate = async () => {
    if (!rotateFile) return;
    try {
      setIsProcessing(true);
      const rotatedBlob = await rotatePdfPages(rotateFile.file, rotationAngle);
      downloadFile(rotatedBlob, `rotated-${rotationAngle}deg-${rotateFile.file.name}`);
      playDownloadSound();
      setDownloadSuccess(`All pages rotated by ${rotationAngle}°!`);
    } catch (err) {
      console.error(err);
      playWarningSound();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#181A1B]">
          Client-Side PDF Document Studio
        </h1>
        <p className="text-sm text-[#61666B] mt-1.5 max-w-xl mx-auto">
          Merge certificates, split admit cards, and convert photos into multi-page PDFs with complete offline privacy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 rounded-xl bg-[#F0ECE6] border border-[#E5DFD8] text-xs font-semibold text-[#4A4F54]">
          <button
            onClick={() => {
              setActiveTab('merge-pdf');
              setDownloadSuccess(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'merge-pdf'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Merge PDFs
          </button>
          <button
            onClick={() => {
              setActiveTab('split-pdf');
              setDownloadSuccess(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'split-pdf'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Split / Extract
          </button>
          <button
            onClick={() => {
              setActiveTab('jpg-to-pdf');
              setDownloadSuccess(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'jpg-to-pdf'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Images to PDF
          </button>
          <button
            onClick={() => {
              setActiveTab('rotate-pdf');
              setDownloadSuccess(null);
            }}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'rotate-pdf'
                ? 'bg-white text-[#181A1B] shadow-xs'
                : 'hover:text-[#181A1B]'
            }`}
          >
            Rotate Pages
          </button>
        </div>
      </div>

      {/* Tab: Merge */}
      {activeTab === 'merge-pdf' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE5]">
            <div>
              <h2 className="text-base font-bold text-[#181A1B]">
                Merge Multiple PDF Files
              </h2>
              <p className="text-xs text-[#71767B] mt-0.5">
                Combine marksheets, certificates, and affidavits into one consolidated PDF.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add PDF</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleMergeFilesAdded(e.target.files);
                }
              }}
            />
          </div>

          {mergeFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="my-8 rounded-xl border-2 border-dashed border-[#DCD6CE] hover:border-[#C85A17] p-8 text-center cursor-pointer bg-[#FAF8F5]"
            >
              <FileText className="w-10 h-10 text-[#C85A17] mx-auto mb-2" />
              <div className="text-sm font-bold text-[#181A1B]">Select 2 or more PDF files</div>
              <div className="text-xs text-[#71767B] mt-0.5">Files are merged entirely in your browser memory</div>
            </div>
          ) : (
            <div className="my-6 space-y-2">
              {mergeFiles.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-[#EAE4DD] bg-[#FAF8F5] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#E5DFD8] text-[#181A1B] font-bold text-[11px] flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-[#181A1B]">{item.file.name}</div>
                      <div className="text-[11px] text-[#71767B]">
                        {item.pages} pages • {formatBytes(item.file.size)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => {
                          const copy = [...mergeFiles];
                          const temp = copy[index - 1];
                          copy[index - 1] = copy[index];
                          copy[index] = temp;
                          setMergeFiles(copy);
                        }}
                        title="Move Up"
                        className="p-1 rounded hover:bg-[#EAE4DD] text-[#71767B] cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                    )}
                    {index < mergeFiles.length - 1 && (
                      <button
                        onClick={() => {
                          const copy = [...mergeFiles];
                          const temp = copy[index + 1];
                          copy[index + 1] = copy[index];
                          copy[index] = temp;
                          setMergeFiles(copy);
                        }}
                        title="Move Down"
                        className="p-1 rounded hover:bg-[#EAE4DD] text-[#71767B] cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setMergeFiles(mergeFiles.filter((m) => m.id !== item.id))}
                      className="p-1 rounded hover:bg-[#FCE8E6] text-[#C84125] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-[#F0EBE5] flex items-center justify-between">
            <div className="text-xs text-[#52796F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>No document ever uploads to external servers.</span>
            </div>
            <button
              onClick={handleExecuteMerge}
              disabled={mergeFiles.length < 2 || isProcessing}
              className="px-6 py-2.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Merge & Download ({mergeFiles.length} Files)
            </button>
          </div>
        </div>
      )}

      {/* Tab: Split */}
      {activeTab === 'split-pdf' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B]">
            Split PDF / Extract Specific Pages
          </h2>
          <p className="text-xs text-[#71767B] mt-0.5">
            Extract only your admit card or first page from large multiple-page notifications.
          </p>

          {!splitFile ? (
            <label className="block my-6 rounded-xl border-2 border-dashed border-[#DCD6CE] hover:border-[#C85A17] p-8 text-center cursor-pointer bg-[#FAF8F5]">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleSplitFileAdded(e.target.files[0]);
                  }
                }}
              />
              <FileText className="w-10 h-10 text-[#C85A17] mx-auto mb-2" />
              <div className="text-sm font-bold text-[#181A1B]">Choose PDF to Split</div>
              <div className="text-xs text-[#71767B] mt-0.5">Loads instantly in browser</div>
            </label>
          ) : (
            <div className="my-6 space-y-4">
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4DD] text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#181A1B]">{splitFile.file.name}</div>
                  <div className="text-[#71767B]">{splitFile.pages} total pages • {formatBytes(splitFile.file.size)}</div>
                </div>
                <button
                  onClick={() => setSplitFile(null)}
                  className="text-xs text-[#C84125] font-medium hover:underline cursor-pointer"
                >
                  Choose different PDF
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#181A1B] block mb-1">
                  Pages to Extract (e.g. 1-2 or 1,3,5)
                </label>
                <input
                  type="text"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  placeholder={`1-${splitFile.pages}`}
                  className="w-full px-3 py-2 rounded-lg border border-[#D5CFC9] text-xs font-mono font-bold text-[#181A1B]"
                />
              </div>

              <div className="pt-3 border-t border-[#F0EBE5] flex justify-end">
                <button
                  onClick={handleExecuteSplit}
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold cursor-pointer"
                >
                  Extract Pages & Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: JPG to PDF */}
      {activeTab === 'jpg-to-pdf' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE5]">
            <div>
              <h2 className="text-base font-bold text-[#181A1B]">
                Convert Images to PDF
              </h2>
              <p className="text-xs text-[#71767B] mt-0.5">
                Turn scanned certificate photos into a clean, official single PDF document.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-medium cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleImagesAdded(e.target.files);
                  }
                }}
              />
              <Plus className="w-4 h-4" />
              <span>Add Images</span>
            </label>
          </div>

          {imageFiles.length === 0 ? (
            <div className="my-8 rounded-xl border-2 border-dashed border-[#DCD6CE] hover:border-[#C85A17] p-8 text-center bg-[#FAF8F5]">
              <Layers className="w-10 h-10 text-[#C85A17] mx-auto mb-2" />
              <div className="text-sm font-bold text-[#181A1B]">Upload Certificate Images (JPG/PNG)</div>
              <div className="text-xs text-[#71767B] mt-0.5">Each image becomes one clean page in the resulting PDF</div>
            </div>
          ) : (
            <div className="my-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {imageFiles.map((img, idx) => (
                  <div key={img.id} className="relative rounded-lg border border-[#EAE4DD] p-2 bg-[#FAF8F5] text-xs">
                    <img src={img.preview} alt="Thumb" className="w-full h-24 object-contain rounded mb-1 bg-white" />
                    <div className="font-semibold truncate text-[#181A1B]">{img.file.name}</div>
                    <div className="text-[10px] text-[#71767B]">Page {idx + 1}</div>
                    <button
                      onClick={() => setImageFiles(imageFiles.filter((i) => i.id !== img.id))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-red-600 text-white cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs pt-2">
                <span className="font-semibold text-[#181A1B]">Page Orientation:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    checked={pageOrientation === 'portrait'}
                    onChange={() => setPageOrientation('portrait')}
                    className="accent-[#C85A17]"
                  />
                  <span>Portrait</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    checked={pageOrientation === 'landscape'}
                    onChange={() => setPageOrientation('landscape')}
                    className="accent-[#C85A17]"
                  />
                  <span>Landscape</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F0EBE5] flex justify-end">
                <button
                  onClick={handleExecuteImagesToPdf}
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold cursor-pointer"
                >
                  Generate PDF & Download ({imageFiles.length} Pages)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Rotate */}
      {activeTab === 'rotate-pdf' && (
        <div className="bg-white rounded-xl border border-[#E5DFD8] p-6 shadow-xs">
          <h2 className="text-base font-bold text-[#181A1B]">Rotate PDF Pages</h2>
          <p className="text-xs text-[#71767B] mt-0.5">
            Fix upside-down or sideways scanned government certificates.
          </p>

          {!rotateFile ? (
            <label className="block my-6 rounded-xl border-2 border-dashed border-[#DCD6CE] hover:border-[#C85A17] p-8 text-center cursor-pointer bg-[#FAF8F5]">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleRotateFileAdded(e.target.files[0]);
                  }
                }}
              />
              <RotateCw className="w-10 h-10 text-[#C85A17] mx-auto mb-2" />
              <div className="text-sm font-bold text-[#181A1B]">Select PDF to Rotate</div>
            </label>
          ) : (
            <div className="my-6 space-y-4">
              <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EAE4DD] text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold text-[#181A1B]">{rotateFile.file.name}</div>
                  <div className="text-[#71767B]">{rotateFile.pages} pages</div>
                </div>
                <button
                  onClick={() => setRotateFile(null)}
                  className="text-xs text-[#C84125] font-medium hover:underline cursor-pointer"
                >
                  Select another PDF
                </button>
              </div>

              <div className="flex gap-2">
                {[90, 180, 270].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setRotationAngle(deg)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                      rotationAngle === deg
                        ? 'border-[#C85A17] bg-[#FAF4ED] text-[#C85A17]'
                        : 'border-[#D5CFC9] bg-white text-[#4A4F54]'
                    }`}
                  >
                    Rotate {deg}° Clockwise
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#F0EBE5] flex justify-end">
                <button
                  onClick={handleExecuteRotate}
                  disabled={isProcessing}
                  className="px-6 py-2 rounded-lg bg-[#181A1B] hover:bg-[#2C2F33] text-white text-xs font-semibold cursor-pointer"
                >
                  Apply Rotation & Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="mt-4 p-4 rounded-xl bg-[#FAF6F0] border border-[#E5DCD0] flex items-center justify-between text-xs font-medium text-[#1E7245]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            <span>{downloadSuccess}</span>
          </div>
          <button
            onClick={() => onNavigateTool?.('photo-resizer')}
            className="text-xs text-[#181A1B] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            Need to prepare photos? <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
