import { ToolItem } from '../types';

export const ALL_TOOLS: ToolItem[] = [
  // IMAGE & PHOTO TOOLS
  {
    id: 'photo-resizer',
    name: 'Photo Resizer',
    slug: 'photo-resizer',
    category: 'photo',
    description: 'Resize application photos to exact pixel or centimeter dimensions.',
    iconName: 'Maximize2',
    popular: true,
    tags: ['resize', 'dimensions', 'width', 'height', 'photo', 'cm', 'px'],
    recommendedNext: ['image-compressor', 'image-cropper', 'add-name-date', 'signature-resizer', 'jpg-to-pdf']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'photo',
    description: 'Compress photos down to 20 KB, 50 KB, 100 KB or custom target file size without visible blur.',
    iconName: 'Minimize2',
    popular: true,
    tags: ['compress', 'reduce file size', 'target kb', '20kb', '50kb', '100kb', 'mb to kb'],
    recommendedNext: ['photo-resizer', 'image-cropper', 'add-name-date', 'signature-compressor']
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    category: 'photo',
    description: 'Crop images to 1:1, 3:4, passport ratio, or custom framing with precision.',
    iconName: 'Crop',
    popular: true,
    tags: ['crop', 'ratio', 'aspect ratio', 'passport', '1:1', '3:4'],
    recommendedNext: ['photo-resizer', 'image-compressor', 'passport-photo-maker']
  },
  {
    id: 'passport-photo-maker',
    name: 'Passport Photo Maker',
    slug: 'passport-photo-maker',
    category: 'photo',
    description: 'Format photos for 3.5x4.5 cm Indian/EU passport or 2x2 inch US Visa standard.',
    iconName: 'UserCheck',
    popular: true,
    tags: ['passport', 'visa', '3.5x4.5', '2x2', 'ds160', 'official'],
    recommendedNext: ['add-name-date', 'background-color-tool', 'image-compressor']
  },
  {
    id: 'add-name-date',
    name: 'Add Name & Date to Photo',
    slug: 'add-name-date',
    category: 'photo',
    description: 'Overlay candidate name and date of photo (D.O.P) as mandated by UPSC, SSC, and state exams.',
    iconName: 'CalendarPlus',
    popular: true,
    tags: ['name and date', 'dop', 'candidate name', 'upsc photo', 'ssc photo', 'official'],
    recommendedNext: ['photo-resizer', 'image-compressor', 'signature-resizer']
  },
  {
    id: 'background-color-tool',
    name: 'Background Color Tool',
    slug: 'background-color-tool',
    category: 'photo',
    description: 'Switch or replace background with plain white, light gray, or solid custom colors.',
    iconName: 'Palette',
    tags: ['background', 'white background', 'color', 'replace background'],
    recommendedNext: ['photo-resizer', 'image-compressor']
  },
  {
    id: 'image-dpi-tool',
    name: 'Image DPI Tool',
    slug: 'image-dpi-tool',
    category: 'photo',
    description: 'Inspect and calculate DPI (dots per inch) for 200 DPI or 300 DPI print requirements.',
    iconName: 'ScanLine',
    tags: ['dpi', 'dots per inch', 'print resolution', '300 dpi', '200 dpi'],
    recommendedNext: ['photo-resizer', 'image-compressor']
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    slug: 'jpg-to-png',
    category: 'photo',
    description: 'Convert JPEG/JPG images to lossless PNG format in your browser.',
    iconName: 'ArrowRightLeft',
    tags: ['jpg', 'png', 'convert', 'format'],
    recommendedNext: ['png-to-jpg', 'image-compressor']
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    slug: 'png-to-jpg',
    category: 'photo',
    description: 'Convert PNG graphics and documents to lightweight JPG for portal submission.',
    iconName: 'ArrowRightLeft',
    tags: ['png', 'jpg', 'jpeg', 'convert'],
    recommendedNext: ['image-compressor', 'photo-resizer']
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    slug: 'webp-converter',
    category: 'photo',
    description: 'Convert to and from modern WebP format for fast web delivery.',
    iconName: 'RefreshCw',
    tags: ['webp', 'convert', 'jpg to webp', 'webp to png'],
    recommendedNext: ['image-compressor', 'photo-resizer']
  },

  // SIGNATURE TOOLS
  {
    id: 'signature-resizer',
    name: 'Signature Resizer',
    slug: 'signature-resizer',
    category: 'signature',
    description: 'Resize signature scans to exact dimensions (e.g. 140x60 px, 4x2 cm) required by portals.',
    iconName: 'FileSignature',
    popular: true,
    tags: ['signature', 'resize signature', '140x60', 'ibps signature', 'ssc signature'],
    recommendedNext: ['signature-compressor', 'signature-background-cleaner', 'photo-resizer']
  },
  {
    id: 'signature-compressor',
    name: 'Signature Compressor',
    slug: 'signature-compressor',
    category: 'signature',
    description: 'Compress signatures strictly between 10 KB to 20 KB or 4 KB to 30 KB with clear dark ink.',
    iconName: 'SlidersHorizontal',
    popular: true,
    tags: ['signature 10kb', 'signature 20kb', 'signature compress', 'file size'],
    recommendedNext: ['signature-resizer', 'signature-background-cleaner', 'photo-resizer']
  },
  {
    id: 'signature-background-cleaner',
    name: 'Signature Background Cleaner',
    slug: 'signature-background-cleaner',
    category: 'signature',
    description: 'Remove shadows and grey paper tone, turning background pure white or transparent while darkening ink.',
    iconName: 'Sparkles',
    popular: true,
    tags: ['clean signature', 'white background', 'remove paper shadow', 'transparent signature', 'auto-trim'],
    recommendedNext: ['signature-resizer', 'signature-compressor']
  },
  {
    id: 'signature-auto-trim',
    name: 'Signature Auto-Trim Whitespace',
    slug: 'signature-auto-trim',
    category: 'signature',
    description: 'Detect ink bounds and automatically trim unnecessary white space around signatures.',
    iconName: 'Scissors',
    tags: ['trim', 'crop signature', 'whitespace', 'bounding box'],
    recommendedNext: ['signature-resizer', 'signature-compressor']
  },

  // PDF TOOLS
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'pdf',
    description: 'Convert one or multiple photo/certificate images into clean A4 or Letter PDF documents.',
    iconName: 'FileText',
    popular: true,
    tags: ['jpg to pdf', 'image to pdf', 'photo to pdf', 'certificate to pdf'],
    recommendedNext: ['merge-pdf', 'pdf-compressor', 'split-pdf']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    category: 'pdf',
    description: 'Combine multiple PDF documents into a single organized file completely on-device.',
    iconName: 'Files',
    popular: true,
    tags: ['merge pdf', 'combine pdf', 'join pdf', 'multiple pdf'],
    recommendedNext: ['split-pdf', 'pdf-rotate', 'jpg-to-pdf']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    category: 'pdf',
    description: 'Extract specific pages or page ranges from any PDF without downloading external software.',
    iconName: 'Split',
    tags: ['split pdf', 'extract pages', 'separate pdf', 'page range'],
    recommendedNext: ['merge-pdf', 'pdf-rotate']
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF',
    slug: 'pdf-rotate',
    category: 'pdf',
    description: 'Fix upside-down or sideways PDF certificates and marksheets with 90° and 180° rotation.',
    iconName: 'RotateCw',
    tags: ['rotate pdf', 'turn pdf', 'orientation', 'landscape to portrait'],
    recommendedNext: ['merge-pdf', 'split-pdf']
  },
  {
    id: 'pdf-metadata',
    name: 'PDF Metadata Cleaner',
    slug: 'pdf-metadata',
    category: 'pdf',
    description: 'Inspect document properties (author, creator, title) and strip sensitive metadata for privacy.',
    iconName: 'ShieldCheck',
    tags: ['metadata', 'privacy', 'strip metadata', 'author', 'properties'],
    recommendedNext: ['merge-pdf', 'jpg-to-pdf']
  },

  // DOCUMENT TOOLS
  {
    id: 'document-scanner-cleaner',
    name: 'Document Scanner Cleaner',
    slug: 'document-scanner-cleaner',
    category: 'document',
    description: 'Enhance phone photos of certificates, marksheets, and receipts with adaptive B&W and contrast filters.',
    iconName: 'FileCheck2',
    popular: true,
    tags: ['scan', 'document clean', 'certificate', 'black and white', 'threshold', 'scanner'],
    recommendedNext: ['jpg-to-pdf', 'image-compressor']
  },
  {
    id: 'file-size-reducer',
    name: 'File Size Reducer',
    slug: 'file-size-reducer',
    category: 'document',
    description: 'Instantly downscale heavy document images to comply with 100 KB, 200 KB, or 500 KB portal limits.',
    iconName: 'DownloadCloud',
    tags: ['file size', 'reducer', 'document size', 'portal limit'],
    recommendedNext: ['document-scanner-cleaner', 'jpg-to-pdf']
  },

  // CALCULATORS
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'calculator',
    description: 'Compute marks percentages, proportion of total, and percentage increase or decrease.',
    iconName: 'Percent',
    tags: ['percentage', 'marks percentage', 'exam score', 'ratio'],
    recommendedNext: ['cgpa-calculator', 'attendance-calculator']
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA to Percentage Calculator',
    slug: 'cgpa-calculator',
    category: 'calculator',
    description: 'Convert university CGPA/SGPA to percentage using standard CBSE (×9.5) and university formulas.',
    iconName: 'GraduationCap',
    popular: true,
    tags: ['cgpa to percentage', 'sgpa', 'cbse cgpa', 'university grades', 'gpa'],
    recommendedNext: ['sgpa-calculator', 'attendance-calculator']
  },
  {
    id: 'sgpa-calculator',
    name: 'SGPA Calculator',
    slug: 'sgpa-calculator',
    category: 'calculator',
    description: 'Calculate Semester Grade Point Average from course credits and grade points.',
    iconName: 'Award',
    tags: ['sgpa', 'semester gpa', 'credit calculation', 'grade point'],
    recommendedNext: ['cgpa-calculator', 'percentage-calculator']
  },
  {
    id: 'attendance-calculator',
    name: 'Attendance Calculator (75% Target)',
    slug: 'attendance-calculator',
    category: 'calculator',
    description: 'Find out how many classes you need to attend or can safely miss to maintain 75% or 80% criteria.',
    iconName: 'CheckSquare',
    popular: true,
    tags: ['attendance', '75 percent', 'classes missed', 'attendance target', 'bunk calculator'],
    recommendedNext: ['cgpa-calculator', 'age-calculator']
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator for Exams',
    slug: 'age-calculator',
    category: 'calculator',
    description: 'Calculate exact age in Years, Months, and Days as of an official exam cutoff date (e.g. 1st August).',
    iconName: 'Clock',
    popular: true,
    tags: ['age calculator', 'exam eligibility', 'cutoff date', 'dob', 'years months days'],
    recommendedNext: ['date-difference-calculator', 'percentage-calculator']
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    slug: 'date-difference-calculator',
    category: 'calculator',
    description: 'Calculate days, weeks, and months remaining until examination dates.',
    iconName: 'Calendar',
    tags: ['date difference', 'days remaining', 'exam schedule', 'calendar'],
    recommendedNext: ['age-calculator']
  },
  {
    id: 'dpi-calculator',
    name: 'DPI & Pixels Calculator',
    slug: 'dpi-calculator',
    category: 'calculator',
    description: 'Calculate exact pixel dimensions from target print dimensions (cm/inches) at 200 or 300 DPI.',
    iconName: 'Calculator',
    tags: ['dpi calculator', 'pixels to cm', 'cm to pixels', '300 dpi', 'print size'],
    recommendedNext: ['aspect-ratio-calculator', 'photo-resizer']
  },
  {
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    slug: 'aspect-ratio-calculator',
    category: 'calculator',
    description: 'Simplify width:height ratios and calculate missing dimension while preserving proportions.',
    iconName: 'Ratio',
    tags: ['aspect ratio', 'ratio calculator', 'proportions', 'dimensions'],
    recommendedNext: ['dpi-calculator', 'photo-resizer']
  },
  {
    id: 'unit-converter',
    name: 'Dimension Unit Converter',
    slug: 'unit-converter',
    category: 'calculator',
    description: 'Convert between cm, mm, inches, and screen pixels.',
    iconName: 'Scale',
    tags: ['unit converter', 'cm to mm', 'inches to cm', 'pixel conversion'],
    recommendedNext: ['dpi-calculator']
  },
  {
    id: 'file-size-converter',
    name: 'File Size Converter',
    slug: 'file-size-converter',
    category: 'calculator',
    description: 'Convert between Bytes, Kilobytes (KB), Megabytes (MB) in binary (1024) and decimal (1000).',
    iconName: 'HardDrive',
    tags: ['file size converter', 'kb to mb', 'mb to kb', 'bytes calculator'],
    recommendedNext: ['image-compressor']
  }
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: string): ToolItem[] {
  if (category === 'all') return ALL_TOOLS;
  return ALL_TOOLS.filter((t) => t.category === category);
}

export const TOOL_CATEGORIES = [
  { id: 'photo', label: 'Photo Tools' },
  { id: 'signature', label: 'Signature' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'calculator', label: 'Calculators' },
  { id: 'document', label: 'Documents' },
] as const;
