import { ExamRequirement } from '../types';

export const VERIFIED_EXAMS: ExamRequirement[] = [
  {
    id: 'upsc-cse',
    slug: 'upsc',
    name: 'UPSC Civil Services Examination (CSE)',
    shortName: 'UPSC CSE / OTR',
    conductingBody: 'Union Public Service Commission',
    category: 'UPSC',
    description: 'Civil Services Prelims, Mains, NDA, CDS, and OTR (One Time Registration) document specifications.',
    lastVerifiedDate: 'August 14, 2024',
    source: 'UPSC One Time Registration (OTR) & CSE Examination Notice',
    sourceUrl: 'https://upsconline.nic.in',
    photo: {
      minWidthPx: 350,
      maxWidthPx: 1000,
      minHeightPx: 350,
      maxHeightPx: 1000,
      minSizeKb: 20,
      maxSizeKb: 300,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 75,
      requiresNameAndDate: true,
      nameDateInstructions: 'Candidate name and Date of Photograph (D.O.P) taken must be clearly printed. Photo must not be more than 10 days old.',
      additionalNotes: [
        'Candidate appearance must match the photo on exam day (beards/spectacles must be consistent).',
        'Both ears must be clearly visible.',
        'File format must strictly be .jpg or .jpeg.'
      ]
    },
    signature: {
      minWidthPx: 350,
      maxWidthPx: 1000,
      minHeightPx: 350,
      maxHeightPx: 1000,
      minSizeKb: 20,
      maxSizeKb: 300,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Signature must be in running hand, NOT in capital letters.',
        'Must be signed with black ink pen on fresh white paper.',
        'Background must be clean without shadow or bleed-through.'
      ]
    },
    documentsNotes: [
      'Photo ID card (Aadhaar, Passport, Driving License) in PDF format between 20 KB and 300 KB.'
    ]
  },
  {
    id: 'ssc-cgl',
    slug: 'ssc',
    name: 'SSC Combined Graduate Level (CGL & CHSL)',
    shortName: 'SSC CGL / CHSL',
    conductingBody: 'Staff Selection Commission',
    category: 'SSC',
    description: 'Mandatory dimensions and file size guidelines for SSC CGL, CHSL, MTS, and GD online forms.',
    lastVerifiedDate: 'July 22, 2024',
    source: 'SSC Official Notice of Examination',
    sourceUrl: 'https://ssc.gov.in',
    photo: {
      widthPx: 140,
      heightPx: 190,
      minWidthPx: 100,
      maxWidthPx: 200,
      minHeightPx: 120,
      maxHeightPx: 230,
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 20,
      maxSizeKb: 50,
      format: 'jpg',
      backgroundColor: '#F5F5F5',
      faceCoveragePercent: 70,
      requiresNameAndDate: false,
      additionalNotes: [
        'Caps, hats, and dark spectacles are strictly disallowed.',
        'Background must be plain light or white color.',
        'Dimensions approximately 3.5 cm width x 4.5 cm height.'
      ]
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      widthCm: 4.0,
      heightCm: 2.0,
      minSizeKb: 10,
      maxSizeKb: 20,
      format: 'jpg',
      inkColor: 'black_or_blue',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Must be horizontal rectangular orientation: 4.0 cm width x 2.0 cm height.',
        'File size strictly between 10.0 KB and 20.0 KB.',
        'Signatures in CAPITAL letters will be rejected.'
      ]
    }
  },
  {
    id: 'up-pet',
    slug: 'up-pet',
    name: 'UPSSSC Preliminary Eligibility Test (UP PET)',
    shortName: 'UP PET / UPSSSC',
    conductingBody: 'Uttar Pradesh Subordinate Services Selection Commission',
    category: 'State Exams',
    description: 'Official requirements for UP PET, VDO, Lekhpal, and Junior Assistant recruitment applications.',
    lastVerifiedDate: 'May 18, 2024',
    source: 'UPSSSC Application Manual & Notification',
    sourceUrl: 'https://upsssc.gov.in',
    photo: {
      widthPx: 132,
      heightPx: 170,
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 10,
      maxSizeKb: 50,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 70,
      requiresNameAndDate: false,
      additionalNotes: [
        'Photo must be recent (taken within the last 6 months).',
        'Background should be light grey or white.',
        'Maximum file size: 50 KB.'
      ]
    },
    signature: {
      widthPx: 132,
      heightPx: 57,
      widthCm: 3.5,
      heightCm: 1.5,
      minSizeKb: 5,
      maxSizeKb: 30,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'SPECIAL UPSSSC RULE: Must write Candidate Name in Hindi script right below English signature within the same frame.',
        'Dimensions: 3.5 cm width x 1.5 cm height.',
        'File size under 30 KB.'
      ]
    }
  },
  {
    id: 'ibps-po',
    slug: 'ibps',
    name: 'IBPS PO / Clerk / SO Examination',
    shortName: 'IBPS Banking',
    conductingBody: 'Institute of Banking Personnel Selection',
    category: 'Banking',
    description: 'Unified photo and signature guidelines for all nationalized bank PO and Clerk recruitment.',
    lastVerifiedDate: 'August 02, 2024',
    source: 'IBPS Common Recruitment Process Notification',
    sourceUrl: 'https://www.ibps.in',
    photo: {
      widthPx: 200,
      heightPx: 230,
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 20,
      maxSizeKb: 50,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 75,
      requiresNameAndDate: false,
      additionalNotes: [
        'Dimensions must be exactly 200 x 230 pixels preferred.',
        'Light coloured, preferably white background.',
        'No red-eye, reflections on spectacles, or shadows.'
      ]
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      minSizeKb: 10,
      maxSizeKb: 20,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Dimensions: 140 x 60 pixels.',
        'Signed with black ink pen only.',
        'Block capital letters strictly prohibited.'
      ]
    },
    documentsNotes: [
      'Left thumb impression: 240x240 px, 20-50 KB, blue/black ink.',
      'Handwritten declaration: 800x400 px, 50-100 KB, black ink on white paper.'
    ]
  },
  {
    id: 'sbi-po',
    slug: 'sbi',
    name: 'State Bank of India (SBI PO & Clerk)',
    shortName: 'SBI PO / Clerk',
    conductingBody: 'State Bank of India',
    category: 'Banking',
    description: 'Prescribed photo, signature, and declaration sizes for SBI career applications.',
    lastVerifiedDate: 'September 05, 2024',
    source: 'SBI Central Recruitment & Promotion Department Guidelines',
    sourceUrl: 'https://sbi.co.in/careers',
    photo: {
      widthPx: 200,
      heightPx: 230,
      minSizeKb: 20,
      maxSizeKb: 50,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 75,
      requiresNameAndDate: false,
      additionalNotes: [
        '200 x 230 pixels resolution.',
        'File size between 20 KB and 50 KB.',
        'White or light background.'
      ]
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      minSizeKb: 10,
      maxSizeKb: 20,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        '140 x 60 pixels resolution.',
        'Signed using black ballpoint or gel pen.'
      ]
    }
  },
  {
    id: 'rrb-railway',
    slug: 'rrb',
    name: 'RRB Railway Recruitment Board (NTPC / Group D / ALP)',
    shortName: 'RRB Railway',
    conductingBody: 'Railway Recruitment Boards',
    category: 'Railway',
    description: 'Specifications for all Indian Railways CEN notifications and CEN exams.',
    lastVerifiedDate: 'June 19, 2024',
    source: 'RRB Centralized Employment Notice Guidelines',
    sourceUrl: 'https://rrbcdg.gov.in',
    photo: {
      widthPx: 240,
      heightPx: 320,
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 20,
      maxSizeKb: 50,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 70,
      requiresNameAndDate: false,
      additionalNotes: [
        'Color photograph with clear white or light background.',
        'Must be taken without goggles, cap, or colored glasses.',
        'Size must be between 20 KB and 50 KB.'
      ]
    },
    signature: {
      widthPx: 140,
      heightPx: 60,
      minSizeKb: 10,
      maxSizeKb: 40,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Signatures in capital letters will be straightaway rejected.',
        'Clean white paper with dark black ink pen.'
      ]
    }
  },
  {
    id: 'neet-ug',
    slug: 'neet',
    name: 'NEET UG Medical Entrance Examination',
    shortName: 'NEET UG (NTA)',
    conductingBody: 'National Testing Agency (NTA)',
    category: 'Medical',
    description: 'Mandatory passport photo, postcard photo (4x6 in), and signature guidelines for NEET medical entrance.',
    lastVerifiedDate: 'March 11, 2024',
    source: 'NTA NEET Information Bulletin',
    sourceUrl: 'https://neet.nta.nic.in',
    photo: {
      minWidthPx: 300,
      maxWidthPx: 800,
      minHeightPx: 400,
      maxHeightPx: 1000,
      minSizeKb: 10,
      maxSizeKb: 200,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 80,
      requiresNameAndDate: true,
      nameDateInstructions: 'Candidate Name and Date of Photograph must be printed on the lower portion of the image. White background mandatory.',
      additionalNotes: [
        '80% face coverage with ears clearly visible.',
        'Polaroid and computer-generated photos not allowed.',
        'Size between 10 KB to 200 KB in JPG format.'
      ]
    },
    signature: {
      minWidthPx: 200,
      maxWidthPx: 600,
      minHeightPx: 100,
      maxHeightPx: 300,
      minSizeKb: 4,
      maxSizeKb: 30,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Must be signed in running handwriting on white paper.',
        'Size between 4 KB and 30 KB.',
        'Black ink pen recommended.'
      ]
    },
    documentsNotes: [
      'Postcard size photo (4"x6") required separately between 10 KB and 200 KB.',
      'Left and right-hand fingers and thumb impression between 10 KB and 200 KB.'
    ]
  },
  {
    id: 'jee-main',
    slug: 'jee',
    name: 'JEE Main & JEE Advanced',
    shortName: 'JEE Main (NTA)',
    conductingBody: 'National Testing Agency (NTA)',
    category: 'Engineering',
    description: 'Engineering entrance specifications for JEE Main Sessions 1 & 2.',
    lastVerifiedDate: 'January 15, 2024',
    source: 'NTA JEE Main Information Bulletin',
    sourceUrl: 'https://jeemain.nta.nic.in',
    photo: {
      minWidthPx: 300,
      maxWidthPx: 600,
      minHeightPx: 400,
      maxHeightPx: 800,
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 10,
      maxSizeKb: 200,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 80,
      requiresNameAndDate: false,
      additionalNotes: [
        'White background with 80% face visible including ears.',
        'Spectacles permitted only if used regularly.',
        'Size 10 KB to 200 KB.'
      ]
    },
    signature: {
      minWidthPx: 200,
      maxWidthPx: 500,
      minHeightPx: 80,
      maxHeightPx: 200,
      minSizeKb: 4,
      maxSizeKb: 30,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'Black ink pen on white paper.',
        'Running hand signature only.',
        'Size 4 KB to 30 KB.'
      ]
    }
  },
  {
    id: 'cuet-ug',
    slug: 'cuet',
    name: 'CUET UG / PG Common University Entrance Test',
    shortName: 'CUET (NTA)',
    conductingBody: 'National Testing Agency (NTA)',
    category: 'University',
    description: 'Document guidelines for Central Universities admissions via CUET portal.',
    lastVerifiedDate: 'February 28, 2024',
    source: 'NTA CUET Information Bulletin',
    sourceUrl: 'https://cuet.samarth.ac.in',
    photo: {
      widthCm: 3.5,
      heightCm: 4.5,
      minSizeKb: 10,
      maxSizeKb: 200,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 80,
      requiresNameAndDate: false,
      additionalNotes: [
        'White background, 80% face coverage.',
        'File size strictly 10 KB to 200 KB.'
      ]
    },
    signature: {
      minSizeKb: 4,
      maxSizeKb: 30,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        'File size strictly 4 KB to 30 KB.',
        'Black ink on clean white background.'
      ]
    }
  },
  {
    id: 'nda-cds',
    slug: 'defence',
    name: 'UPSC NDA & CDS Defence Academy',
    shortName: 'NDA / CDS / AFCAT',
    conductingBody: 'Union Public Service Commission & Indian Air Force',
    category: 'Defence',
    description: 'Document sizes for National Defence Academy and Combined Defence Services examinations.',
    lastVerifiedDate: 'May 10, 2024',
    source: 'UPSC Defence Examination Notification',
    sourceUrl: 'https://upsc.gov.in',
    photo: {
      minWidthPx: 350,
      maxWidthPx: 1000,
      minHeightPx: 350,
      maxHeightPx: 1000,
      minSizeKb: 20,
      maxSizeKb: 300,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 75,
      requiresNameAndDate: true,
      nameDateInstructions: 'Candidate Name and Date of Photograph (within 10 days of notice) printed clearly.',
      additionalNotes: [
        'Square ratio 1:1 preferred (minimum 350x350 pixels).',
        '20 KB to 300 KB.'
      ]
    },
    signature: {
      minWidthPx: 350,
      maxWidthPx: 1000,
      minHeightPx: 350,
      maxHeightPx: 1000,
      minSizeKb: 20,
      maxSizeKb: 300,
      format: 'jpg',
      inkColor: 'black',
      backgroundColor: '#FFFFFF',
      additionalNotes: [
        '20 KB to 300 KB file size.',
        'Square or rectangular framing.'
      ]
    }
  },
  {
    id: 'us-visa',
    slug: 'us-visa',
    name: 'US Visa (DS-160) & OCI / Passport',
    shortName: 'US Visa / 2x2"',
    conductingBody: 'U.S. Department of State',
    category: 'International',
    description: 'Strict 2x2 inch square digital photo requirements for US Nonimmigrant & Immigrant visas and OCI cards.',
    lastVerifiedDate: 'January 20, 2024',
    source: 'U.S. Travel State Gov Official Photo Guidelines',
    sourceUrl: 'https://travel.state.gov',
    photo: {
      widthPx: 600,
      heightPx: 600,
      minWidthPx: 600,
      maxWidthPx: 1200,
      minHeightPx: 600,
      maxHeightPx: 1200,
      minSizeKb: 40,
      maxSizeKb: 240,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      faceCoveragePercent: 60,
      requiresNameAndDate: false,
      additionalNotes: [
        'Strictly square 1:1 aspect ratio (600x600 px to 1200x1200 px).',
        'Head must be centered between 50% and 69% of the total image height.',
        'Eyes must be between 56% and 69% from the bottom of the image.',
        'Eyeglasses are NOT permitted under any circumstances.',
        'Plain white or off-white background.'
      ]
    },
    signature: {
      widthPx: 300,
      heightPx: 100,
      minSizeKb: 10,
      maxSizeKb: 100,
      format: 'jpg',
      backgroundColor: '#FFFFFF',
      additionalNotes: ['Clean black ink signature on white background.']
    }
  }
];

export function getExamBySlug(slug: string): ExamRequirement | undefined {
  return VERIFIED_EXAMS.find((e) => e.slug.toLowerCase() === slug.toLowerCase() || e.id === slug);
}
