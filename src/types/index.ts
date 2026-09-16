export type ToolCategory =
  | 'photo'
  | 'signature'
  | 'pdf'
  | 'document'
  | 'calculator'
  | 'exam';

export interface ToolItem {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  popular?: boolean;
  recommendedNext?: string[];
  tags: string[];
}

export interface ExamPhotoRequirement {
  widthPx?: number;
  heightPx?: number;
  minWidthPx?: number;
  maxWidthPx?: number;
  minHeightPx?: number;
  maxHeightPx?: number;
  widthCm?: number;
  heightCm?: number;
  minSizeKb: number;
  maxSizeKb: number;
  format: 'jpg' | 'jpeg' | 'png';
  backgroundColor?: string;
  faceCoveragePercent?: number;
  requiresNameAndDate?: boolean;
  nameDateInstructions?: string;
  additionalNotes?: string[];
}

export interface ExamSignatureRequirement {
  widthPx?: number;
  heightPx?: number;
  minWidthPx?: number;
  maxWidthPx?: number;
  minHeightPx?: number;
  maxHeightPx?: number;
  widthCm?: number;
  heightCm?: number;
  minSizeKb: number;
  maxSizeKb: number;
  format: 'jpg' | 'jpeg' | 'png';
  inkColor?: 'black' | 'blue' | 'black_or_blue';
  backgroundColor?: string;
  additionalNotes?: string[];
}

export interface ExamRequirement {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  conductingBody: string;
  category:
    | 'UPSC'
    | 'SSC'
    | 'Banking'
    | 'Railway'
    | 'Defence'
    | 'Medical'
    | 'Engineering'
    | 'State Exams'
    | 'University'
    | 'International';
  description: string;
  lastVerifiedDate: string;
  source: string;
  sourceUrl: string;
  photo: ExamPhotoRequirement;
  signature: ExamSignatureRequirement;
  documentsNotes?: string[];
}

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  readingTimeMinutes: number;
  category: string;
  description: string;
  summary: string;
  sections: {
    heading: string;
    content: string[];
    tips?: string[];
  }[];
  relatedToolSlugs: string[];
  relatedExamSlugs: string[];
  lastUpdated: string;
}

export type SupportedLocale =
  | 'en'
  | 'hi'
  | 'bn'
  | 'mr'
  | 'ta'
  | 'te'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'pa';

export interface UserSettings {
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  locale: SupportedLocale;
  adsEnabled: boolean;
}

export interface ValidationResult {
  valid: boolean;
  checks: {
    id: string;
    label: string;
    passed: boolean;
    currentValue: string;
    expectedValue: string;
    fixable: boolean;
  }[];
}
