export type PortfolioCategory = 'Characters' | 'Game Assets' | 'Props';
export type FilterCategory = 'All' | PortfolioCategory;
export type PassKey = 'beauty' | 'wireframe' | 'clay' | 'uv';

export interface MediaSlotConfig {
  slotId: string;
  label: string;
  spec: string;
  /**
   * Drop your file into `public/renders/` and set e.g. `'renders/demon-bust-beauty.webp'`.
   * Leave as `null` to render the studio `<MediaSlot />` placeholder frame.
   */
  src: string | null;
  alt?: string;
}

export interface BreakdownPass {
  key: PassKey;
  label: string;
  media: MediaSlotConfig;
}

export interface ProjectSpecs {
  discipline: string | null;
  polycount: string | null;
  textures: string | null;
  renderer: string | null;
  software: string[];
  notes: string | null;
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  isEmptySlot?: boolean;
  category: PortfolioCategory | null;
  cardMeta: string;
  thumbnail: MediaSlotConfig;
  passes: BreakdownPass[];
  specs: ProjectSpecs;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface PipelineStage {
  stageNumber: string;
  title: string;
  description: string;
  tools: string[];
}

export const siteConfig = {
  name: 'Zakharii Stroich',
  brandMark: 'ZAKHARII STROICH',
  // Custom domain on Netlify
  domain: '3dartist.dev',
  role: '3D Character & Sculpt Artist',
  location: 'Lublin, Poland',
  availableForWork: true,
  heroSummary:
    'Focused on expressive 3D character sculpting, clean mesh structure, and studio-grade presentation in ZBrush and Blender.',
};

export const heroMedia: MediaSlotConfig = {
  slotId: 'HERO_FEATURED_RENDER',
  label: 'Featured Character Render or Turnaround Loop',
  spec: '4:5 or 16:10 · WebP / MP4',
  src: null, // e.g. 'renders/hero-featured.webp'
  alt: 'Featured 3D character work by Zakharii Stroich',
};

export const filterCategories: FilterCategory[] = [
  'All',
  'Characters',
  'Game Assets',
  'Props',
];

export const projects: ProjectItem[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'Demon Bust',
    isEmptySlot: false,
    category: 'Characters',
    cardMeta: 'SCULPT · ZBRUSH · BLENDER',
    thumbnail: {
      slotId: 'PROJECT_01_BEAUTY',
      label: 'Demon Bust — Main Beauty Render',
      spec: '16:10 · WebP / PNG',
      src: null, // e.g. 'renders/demon-bust-beauty.webp'
      alt: 'Demon Bust 3D sculpt by Zakharii Stroich',
    },
    passes: [
      {
        key: 'beauty',
        label: 'Beauty',
        media: {
          slotId: 'PROJECT_01_BEAUTY',
          label: 'Demon Bust — Final Beauty Render',
          spec: '16:10 · WebP / PNG',
          src: null,
          alt: 'Demon Bust beauty render',
        },
      },
      {
        key: 'wireframe',
        label: 'Wireframe',
        media: {
          slotId: 'PROJECT_01_WIREFRAME',
          label: 'Demon Bust — Mesh / Wireframe View',
          spec: '16:10 · WebP / PNG',
          src: null,
          alt: 'Demon Bust wireframe view',
        },
      },
      {
        key: 'clay',
        label: 'Clay / Sculpt',
        media: {
          slotId: 'PROJECT_01_CLAY',
          label: 'Demon Bust — ZBrush / Clay Sculpt Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
          alt: 'Demon Bust clay sculpt render',
        },
      },
      {
        key: 'uv',
        label: 'UV & Maps',
        media: {
          slotId: 'PROJECT_01_UV',
          label: 'Demon Bust — UV / Maps Breakdown',
          spec: '16:10 · WebP / PNG',
          src: null,
          alt: 'Demon Bust UV and maps pass',
        },
      },
    ],
    specs: {
      discipline: 'Digital Sculpt · Character Bust',
      polycount: null, // Fill in when ready, e.g. 'High-Poly Sculpt' or exact tris
      textures: null, // Fill in if textured, e.g. '4K PBR Maps'
      renderer: null, // Fill in when ready, e.g. 'Blender Cycles'
      software: ['ZBrush', 'Blender'],
      notes: 'Character bust sculpted in ZBrush with scene assembly and presentation in Blender.',
    },
  },
  {
    id: 'project-02',
    number: '02',
    title: 'Project 02',
    isEmptySlot: true,
    category: null, // Set to 'Characters' | 'Game Assets' | 'Props' when publishing
    cardMeta: 'OPEN SLOT · AWAITING PUBLISH',
    thumbnail: {
      slotId: 'PROJECT_02_BEAUTY',
      label: 'Project 02 — Main Beauty Render',
      spec: '16:10 · WebP / MP4',
      src: null,
    },
    passes: [
      {
        key: 'beauty',
        label: 'Beauty',
        media: {
          slotId: 'PROJECT_02_BEAUTY',
          label: 'Project 02 — Beauty Render',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'wireframe',
        label: 'Wireframe',
        media: {
          slotId: 'PROJECT_02_WIREFRAME',
          label: 'Project 02 — Wireframe Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'clay',
        label: 'Clay / Sculpt',
        media: {
          slotId: 'PROJECT_02_CLAY',
          label: 'Project 02 — Clay / Sculpt Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'uv',
        label: 'UV & Maps',
        media: {
          slotId: 'PROJECT_02_UV',
          label: 'Project 02 — UV & Maps Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
    ],
    specs: {
      discipline: null,
      polycount: null,
      textures: null,
      renderer: null,
      software: [],
      notes: 'Empty portfolio slot. Populate project details and render paths in src/data/portfolio.ts.',
    },
  },
  {
    id: 'project-03',
    number: '03',
    title: 'Project 03',
    isEmptySlot: true,
    category: null, // Set to 'Characters' | 'Game Assets' | 'Props' when publishing
    cardMeta: 'OPEN SLOT · AWAITING PUBLISH',
    thumbnail: {
      slotId: 'PROJECT_03_BEAUTY',
      label: 'Project 03 — Main Beauty Render',
      spec: '16:10 · WebP / MP4',
      src: null,
    },
    passes: [
      {
        key: 'beauty',
        label: 'Beauty',
        media: {
          slotId: 'PROJECT_03_BEAUTY',
          label: 'Project 03 — Beauty Render',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'wireframe',
        label: 'Wireframe',
        media: {
          slotId: 'PROJECT_03_WIREFRAME',
          label: 'Project 03 — Wireframe Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'clay',
        label: 'Clay / Sculpt',
        media: {
          slotId: 'PROJECT_03_CLAY',
          label: 'Project 03 — Clay / Sculpt Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'uv',
        label: 'UV & Maps',
        media: {
          slotId: 'PROJECT_03_UV',
          label: 'Project 03 — UV & Maps Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
    ],
    specs: {
      discipline: null,
      polycount: null,
      textures: null,
      renderer: null,
      software: [],
      notes: 'Empty portfolio slot. Populate project details and render paths in src/data/portfolio.ts.',
    },
  },
  {
    id: 'project-04',
    number: '04',
    title: 'Project 04',
    isEmptySlot: true,
    category: null, // Set to 'Characters' | 'Game Assets' | 'Props' when publishing
    cardMeta: 'OPEN SLOT · AWAITING PUBLISH',
    thumbnail: {
      slotId: 'PROJECT_04_BEAUTY',
      label: 'Project 04 — Main Beauty Render',
      spec: '16:10 · WebP / MP4',
      src: null,
    },
    passes: [
      {
        key: 'beauty',
        label: 'Beauty',
        media: {
          slotId: 'PROJECT_04_BEAUTY',
          label: 'Project 04 — Beauty Render',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'wireframe',
        label: 'Wireframe',
        media: {
          slotId: 'PROJECT_04_WIREFRAME',
          label: 'Project 04 — Wireframe Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'clay',
        label: 'Clay / Sculpt',
        media: {
          slotId: 'PROJECT_04_CLAY',
          label: 'Project 04 — Clay / Sculpt Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
      {
        key: 'uv',
        label: 'UV & Maps',
        media: {
          slotId: 'PROJECT_04_UV',
          label: 'Project 04 — UV & Maps Pass',
          spec: '16:10 · WebP / PNG',
          src: null,
        },
      },
    ],
    specs: {
      discipline: null,
      polycount: null,
      textures: null,
      renderer: null,
      software: [],
      notes: 'Empty portfolio slot. Populate project details and render paths in src/data/portfolio.ts.',
    },
  },
];

export const coreSoftware: string[] = ['ZBrush', 'Blender'];

export const pipelineStages: PipelineStage[] = [
  {
    stageNumber: '01',
    title: 'Digital Sculpting & Form',
    description:
      'Primary anatomical blockout, silhouette exploration, expressive character proportions, and high-resolution surface sculpting.',
    tools: ['ZBrush', 'Blender'],
  },
  {
    stageNumber: '02',
    title: 'Modeling & Mesh Structure',
    description:
      'Clean polygon modeling, subdivision surface control, mesh organization, and structured geometry preparation.',
    tools: ['Blender', 'ZBrush'],
  },
  {
    stageNumber: '03',
    title: 'Shading, Lighting & Render',
    description:
      'Material setup, multi-point studio lighting, clay and wireframe breakdown passes, and final presentation rendering.',
    tools: ['Blender', 'ZBrush'],
  },
];

export const aboutData = {
  media: {
    slotId: 'ARTIST_PORTRAIT',
    label: 'Artist Portrait or Workstation Photo',
    spec: '4:5 · WebP / JPG',
    src: null, // e.g. 'renders/portrait.webp'
    alt: 'Zakharii Stroich — 3D Artist in Lublin, Poland',
  } as MediaSlotConfig,
  bio: 'I am a 3D artist focused on character creation and digital sculpting in ZBrush and Blender, based in Lublin, Poland. Alongside my 3D practice, I am a third-year Computer Science student at the John Paul II Catholic University of Lublin (KUL), combining artistic form with a strong technical foundation. My work centers on expressive character sculpts, clean mesh structure, and disciplined workflows from initial blockout to final render.',
  details: [
    { label: 'LOCATION', value: 'Lublin, Poland' },
    { label: 'EDUCATION', value: 'Computer Science (Year 3) · KUL' },
    { label: 'FOCUS', value: '3D Characters & Digital Sculpting' },
    { label: 'SOFTWARE', value: 'ZBrush · Blender' },
  ],
};

export const contactData = {
  email: 'stroichzahar161218@gmail.com',
  /**
   * Optional fallback slot if you prefer not to use `.env` / Netlify environment variables.
   * Primary source is `VITE_WEB3FORMS_ACCESS_KEY` in `.env`.
   * Note: Web3Forms Access Keys are public client-side keys by design.
   */
  web3formsAccessKey: '',
  projectTypes: [
    'Character',
    'Game Asset / Prop',
    'Full-Time / Studio Role',
    'Other',
  ],
  socials: [
    {
      id: 'artstation',
      label: 'ARTSTATION',
      url: 'https://www.artstation.com/zakhariistroich',
      enabled: true,
    },
    {
      id: 'linkedin',
      label: 'LINKEDIN',
      url: 'https://www.linkedin.com/in/zakharii-stroich-74822633a/',
      enabled: true,
    },
    {
      id: 'instagram',
      label: 'INSTAGRAM',
      url: 'https://www.instagram.com/stroichz/',
      enabled: true,
    },
    {
      id: 'github',
      label: 'GITHUB',
      url: 'https://github.com/Dragodar02',
      enabled: true,
    },
  ] as SocialLink[],
};
