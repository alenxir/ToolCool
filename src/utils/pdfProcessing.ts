// Client-side pure PDF Processing engine using pdf-lib
import { PDFDocument, degrees, StandardFonts, rgb } from 'pdf-lib';

export interface ImageToPdfOptions {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: number; // in points (e.g. 20)
  quality?: number;
}

export interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  pageCount: number;
}

// Convert one or more images into a multi-page PDF
export async function convertImagesToPdf(
  files: File[],
  options: ImageToPdfOptions = { pageSize: 'a4', orientation: 'auto', margin: 20 }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Dimensions in points (72 points = 1 inch)
  const pageDimensions = {
    a4: { width: 595.28, height: 841.89 },
    letter: { width: 612, height: 792 },
  };

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

    let embeddedImage;
    if (isPng) {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let targetPageWidth = imgWidth;
    let targetPageHeight = imgHeight;

    if (options.pageSize !== 'fit') {
      const baseDim = pageDimensions[options.pageSize];
      const isImageLandscape = imgWidth > imgHeight;

      if (options.orientation === 'landscape' || (options.orientation === 'auto' && isImageLandscape)) {
        targetPageWidth = Math.max(baseDim.width, baseDim.height);
        targetPageHeight = Math.min(baseDim.width, baseDim.height);
      } else {
        targetPageWidth = Math.min(baseDim.width, baseDim.height);
        targetPageHeight = Math.max(baseDim.width, baseDim.height);
      }
    }

    const margin = options.margin || 0;
    const availableWidth = targetPageWidth - margin * 2;
    const availableHeight = targetPageHeight - margin * 2;

    const scale = Math.min(
      availableWidth / imgWidth,
      availableHeight / imgHeight,
      options.pageSize === 'fit' ? 1 : 10
    );

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = margin + (availableWidth - scaledWidth) / 2;
    const y = margin + (availableHeight - scaledHeight) / 2;

    const page = pdfDoc.addPage([targetPageWidth, targetPageHeight]);
    page.drawImage(embeddedImage, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
    });
  }

  return await pdfDoc.save();
}

// Merge multiple PDFs into a single document
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

// Split PDF by page range (e.g., "1-3, 5, 8-10")
export async function splitPdf(file: File, pageRangeStr: string): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(fileBytes);
  const totalPages = srcDoc.getPageCount();

  const pagesToExtract = parsePageRanges(pageRangeStr, totalPages);
  if (pagesToExtract.length === 0) {
    throw new Error('No valid pages found in specified range');
  }

  const newPdf = await PDFDocument.create();
  // 0-indexed indices for pdf-lib
  const indices = pagesToExtract.map((p) => p - 1);
  const copiedPages = await newPdf.copyPages(srcDoc, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

// Rotate all or specified pages in a PDF
export async function rotatePdf(
  file: File,
  rotationAngle: 90 | 180 | 270
): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationAngle) % 360));
  }

  return await pdfDoc.save();
}

// Inspect PDF Metadata
export async function inspectPdfMetadata(file: File): Promise<PdfMetadata> {
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { updateMetadata: false });

  return {
    title: pdfDoc.getTitle() || undefined,
    author: pdfDoc.getAuthor() || undefined,
    subject: pdfDoc.getSubject() || undefined,
    creator: pdfDoc.getCreator() || undefined,
    producer: pdfDoc.getProducer() || undefined,
    creationDate: pdfDoc.getCreationDate() || undefined,
    modificationDate: pdfDoc.getModificationDate() || undefined,
    pageCount: pdfDoc.getPageCount(),
  };
}

// Strip all PDF metadata for maximum privacy before submitting to portals
export async function stripPdfMetadata(file: File): Promise<Uint8Array> {
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes);

  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setCreator('');
  pdfDoc.setProducer('');
  pdfDoc.setKeywords([]);

  return await pdfDoc.save({ useObjectStreams: true });
}

// Helper to parse page range strings like "1-3, 5, 8"
function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pageSet = new Set<number>();
  const parts = rangeStr.split(/[,;\s]+/).map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          pageSet.add(i);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        pageSet.add(p);
      }
    }
  }

  return Array.from(pageSet).sort((a, b) => a - b);
}

// Convenient helpers returning standard Blobs for UI components
export async function getPdfPageCount(file: File): Promise<number> {
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const bytes = await mergePdfs(files);
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

export async function splitPdfFile(file: File, targetPages: number[]): Promise<Blob> {
  const fileBytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(fileBytes);
  const newPdf = await PDFDocument.create();
  const indices = targetPages.map((p) => p - 1);
  const copiedPages = await newPdf.copyPages(srcDoc, indices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  const bytes = await newPdf.save();
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

export async function rotatePdfPages(file: File, angle: number): Promise<Blob> {
  const rotationAngle = (angle === 180 ? 180 : angle === 270 ? 270 : 90) as 90 | 180 | 270;
  const bytes = await rotatePdf(file, rotationAngle);
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

export async function imagesToPdf(
  files: File[],
  orientation: 'portrait' | 'landscape' = 'portrait'
): Promise<Blob> {
  const bytes = await convertImagesToPdf(files, {
    pageSize: 'a4',
    orientation,
    margin: 20,
  });
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}
