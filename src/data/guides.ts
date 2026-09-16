import { GuideItem } from '../types';

export const GUIDES: GuideItem[] = [
  {
    id: 'how-to-resize-photo-online-application',
    slug: 'how-to-resize-photo-online-application',
    title: 'How to Resize a Photo for an Online Application',
    readingTimeMinutes: 4,
    category: 'Photos',
    description: 'Step-by-step instructions to adjust pixel dimensions, maintain aspect ratio, and meet government exam standards.',
    summary: 'Most exam portals specify strict width and height boundaries in pixels (e.g. 200x230 px) or physical units (3.5 x 4.5 cm). Here is how to prepare your file without stretching or pixelation.',
    sections: [
      {
        heading: '1. Understand the Two Measurements: Pixels vs Centimeters',
        content: [
          'Online portals such as UPSC, SSC, IBPS, and State PSCs define photo requirements in two main ways:',
          '• Direct pixel dimensions (e.g., exactly 200 x 230 px or between 350x350 and 1000x1000 px).',
          '• Physical centimeters with a recommended DPI (e.g., 3.5 cm width × 4.5 cm height at 200 DPI, which yields 276 × 354 pixels).',
          'Never resize an image by dragging corners freehand in a word processor; this alters the natural aspect ratio, making the face look distorted or squished, which causes automatic rejection by the portal computer vision scanners.'
        ],
        tips: [
          'Always crop your photo to the required aspect ratio FIRST before setting the final pixel resolution.',
          'Keep your original high-resolution camera file intact and work on a copy.'
        ]
      },
      {
        heading: '2. The 3-Step Preparation Method',
        content: [
          'Step A: Crop to the standard passport framing. The head should occupy roughly 70% to 80% of the vertical frame, centered with both ears visible and a sliver of shoulders visible.',
          'Step B: Scale dimensions to the upper end of the allowed pixel range (for example, 400x500 px rather than the absolute minimum 100x120 px) to retain crisp clarity.',
          'Step C: Save in standard baseline JPEG (.jpg) format. Do not use progressive JPEG or CMYK color profiles, as legacy government servers cannot decode them.'
        ]
      },
      {
        heading: '3. Common Rejection Pitfalls',
        content: [
          '• Blurry or pixelated resizing from an already tiny WhatsApp preview.',
          '• Distorted aspect ratio where the subject appears artificially thin or stretched wide.',
          '• Dark shadows behind the ears or on the background wall.',
          '• Using photos taken wearing sunglasses, dark tinted glasses, or caps.'
        ]
      }
    ],
    relatedToolSlugs: ['photo-resizer', 'image-compressor', 'image-cropper'],
    relatedExamSlugs: ['upsc', 'ssc', 'ibps'],
    lastUpdated: 'September 2024'
  },
  {
    id: 'how-to-reduce-photo-below-50kb',
    slug: 'how-to-reduce-photo-below-50kb',
    title: 'How to Reduce a Photo Below 50 KB or 20 KB Without Losing Quality',
    readingTimeMinutes: 5,
    category: 'Compression',
    description: 'Learn how smart iterative compression preserves facial features while dropping hefty 5 MB files below tight portal limits.',
    summary: 'Government portals like SSC and IBPS mandate photos between 20 KB and 50 KB, and signatures between 10 KB and 20 KB. Here is the technical breakdown of how to achieve this target safely.',
    sections: [
      {
        heading: '1. Why Naive Compression Makes Photos Blurry',
        content: [
          'When you compress a 4000x3000 pixel smartphone photo down to 50 KB by simply turning down the JPEG quality slider to 10%, the compression algorithm discards high-frequency detail across millions of pixels. The result is intense blocky compression artifacts and unreadable blur.',
          'The correct professional approach is a two-phase reduction:',
          'Phase 1: Downsample the excessive resolution to the portal’s expected display size (e.g., down to 600x800 or 300x400 px). This alone reduces the raw uncompressed data by up to 90%.',
          'Phase 2: Apply gentle JPEG compression (quality 75% to 85%) on the appropriately sized canvas.'
        ]
      },
      {
        heading: '2. Using the Smart Target File Size Mode',
        content: [
          'In ToolCool / ExamReady, select the "Target File Size" option and type "50" or click the 50 KB preset.',
          'Our client-side engine executes a mathematical binary search across JPEG quantization tables on your browser canvas. It fine-tunes quality in small 2% increments until the resulting blob lands strictly under 50 KB (typically 44–48 KB) without introducing unsightly color banding.'
        ],
        tips: [
          'If a portal asks for "Between 20 KB and 50 KB", aim for 35 KB to 45 KB. Aiming for exactly 49.9 KB risks portal calculation rounding errors that reject files exceeding 50.001 KB.'
        ]
      }
    ],
    relatedToolSlugs: ['image-compressor', 'photo-resizer', 'signature-compressor'],
    relatedExamSlugs: ['ssc', 'ibps', 'up-pet'],
    lastUpdated: 'August 2024'
  },
  {
    id: 'how-to-resize-and-clean-signature',
    slug: 'how-to-resize-and-clean-signature',
    title: 'How to Resize and Clean a Digital Signature',
    readingTimeMinutes: 4,
    category: 'Signatures',
    description: 'Fix shadowy grey mobile camera scans, remove paper bleed, and trim excess white borders automatically.',
    summary: 'A signature rejected for illegibility or excessive size can stall your online application. Learn how to scan on white paper, auto-trim margins, and produce a crisp dark-ink digital signature.',
    sections: [
      {
        heading: '1. The Right Way to Capture Your Signature',
        content: [
          '• Always sign on pure white unruled printer paper (avoid ruled notebook paper with blue lines).',
          '• Use a fresh black ballpoint or dark blue gel pen with a medium tip. Avoid fine light pens or leaky markers.',
          '• Take the photo in direct, even daylight. Keep your phone parallel to the paper to prevent perspective slant, and make sure your hand does not cast a shadow over the ink.'
        ]
      },
      {
        heading: '2. Auto-Trim and Background Whitening',
        content: [
          'When you upload your photo to ExamReady’s Signature Workspace:',
          '1. Click "Auto-trim Whitespace". The algorithm scans the pixel data and establishes a tight bounding box around the actual ink strokes, eliminating 80% of unnecessary empty paper.',
          '2. Toggle "Clean Paper Background". This runs adaptive thresholding: shadows and off-white paper grains are clamped to pure #FFFFFF, while ink density is boosted to rich solid black or deep navy.',
          '3. Set the target file size to 10–20 KB as required by SSC, IBPS, and SBI.'
        ],
        tips: [
          'Do NOT sign in ALL CAPITAL LETTERS unless your natural legal signature is spelled in capitals. Official notifications explicitly state that block letter signatures will be disqualified.'
        ]
      }
    ],
    relatedToolSlugs: ['signature-resizer', 'signature-compressor', 'signature-background-cleaner'],
    relatedExamSlugs: ['ssc', 'ibps', 'rrb'],
    lastUpdated: 'September 2024'
  },
  {
    id: 'why-online-application-photos-get-rejected',
    slug: 'why-online-application-photos-get-rejected',
    title: 'Why Online Application Photos Get Rejected (And How to Prevent It)',
    readingTimeMinutes: 6,
    category: 'Guides & Rules',
    description: 'The top 7 reasons government exam portals reject uploaded photographs and signatures during automated verification.',
    summary: 'Every year, tens of thousands of competitive exam applicants receive rejection notices or have admit cards withheld due to photo upload errors. Here are the 7 most common culprits and how to avoid them.',
    sections: [
      {
        heading: '1. Top 7 Causes of Photo Disqualification',
        content: [
          '1. Incorrect Aspect Ratio / Face Distortion: Stretching a wide photo into a tall slot makes the face appear unnaturally narrow or wide.',
          '2. Dark or Patterned Background: Portals require a plain light background (pure white or off-white). Curtains, trees, or living room walls are flagged instantly.',
          '3. Flash Glare on Eyeglasses: If the camera flash reflects off your spectacles, concealing the pupils or eyes, the image will fail facial matching.',
          '4. Cropping Too Close or Too Far: Facial coverage must be between 70% and 80%. A photo showing full torso or just chin-to-forehead will fail the bounding box test.',
          '5. Missing Mandatory Name & Date of Photo (D.O.P): UPSC, NDA, CDS, and NEET mandate that the candidate’s name and the date the photo was taken (within 10 days of notice) must be printed at the bottom.',
          '6. File Size Exceeds Hard Limit: Uploading 51 KB when the portal maximum is 50 KB fails client-side JavaScript validation.',
          '7. Wrong MIME / Container Type: Renaming a .png or .webp file to .jpg manually without genuine image conversion causes server-side decoder exceptions.'
        ]
      },
      {
        heading: '2. Pre-Submission Checklist',
        content: [
          '✓ Format is standard baseline JPEG (.jpg).',
          '✓ File size is safely within the target bracket (e.g. 25–45 KB for a 20–50 KB requirement).',
          '✓ Face is centered, eyes look straight into the camera lens with a neutral expression.',
          '✓ Both ears and shoulder tops are clearly visible.',
          '✓ Background is clean, solid light grey or white with zero shadows.'
        ]
      }
    ],
    relatedToolSlugs: ['photo-resizer', 'image-compressor', 'add-name-date', 'passport-photo-maker'],
    relatedExamSlugs: ['upsc', 'neet', 'ssc'],
    lastUpdated: 'August 2024'
  },
  {
    id: 'pixels-vs-dpi-explained',
    slug: 'pixels-vs-dpi-explained',
    title: 'Pixels vs DPI Explained for Government Application Forms',
    readingTimeMinutes: 4,
    category: 'Educational',
    description: 'A simple, clear guide on how DPI relates to physical print size and screen resolution.',
    summary: 'Exam notifications often write "Passport photo 3.5 x 4.5 cm at 200 DPI". What does this actually mean in pixels? Here is the straightforward math.',
    sections: [
      {
        heading: 'The Direct Formula',
        content: [
          'DPI stands for "Dots Per Inch". Since 1 inch = 2.54 centimeters:',
          '• Pixels = (Centimeters / 2.54) × DPI',
          'Let’s calculate a standard 3.5 cm × 4.5 cm passport photo at 200 DPI:',
          '• Width: (3.5 / 2.54) × 200 ≈ 276 pixels',
          '• Height: (4.5 / 2.54) × 200 ≈ 354 pixels',
          'And at 300 DPI (high-resolution print):',
          '• Width: (3.5 / 2.54) × 300 ≈ 413 pixels',
          '• Height: (4.5 / 2.54) × 300 ≈ 531 pixels',
          'When an exam portal states "200 to 300 DPI", setting your image dimensions between 280x350 px and 420x530 px ensures your file will render at exact physical dimensions when the admit card is printed.'
        ]
      }
    ],
    relatedToolSlugs: ['dpi-calculator', 'unit-converter', 'photo-resizer'],
    relatedExamSlugs: ['upsc', 'ssc'],
    lastUpdated: 'July 2024'
  }
];

export function getGuideBySlug(slug: string): GuideItem | undefined {
  return GUIDES.find((g) => g.slug === slug || g.id === slug);
}
