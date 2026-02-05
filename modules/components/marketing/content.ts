export type StudyStep = {
  title: string;
  description: string;
};

export type Benefit = {
  title: string;
  description: string;
  evidenceLabel: string;
  evidenceTitle: string;
  evidenceText: string;
  layout: "wide" | "narrow";
};

export type FeatureBlock = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  points: string[];
  layout: "media-left" | "media-right";
  divider: "none" | "top";
  spacing: string;
  media: "flashcard" | "progress" | "organization";
};

export type MarketingCopy = {
  header: {
    ariaLabel: string;
    nav: { href: string; label: string }[];
    auth: {
      signIn: string;
      getStarted: string;
    };
  };
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    blocks: FeatureBlock[];
  };
  studyLoop: {
    eyebrow: string;
    title: string;
    description: string;
    steps: StudyStep[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    description: string;
    items: Benefit[];
  };
  cta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    footer: {
      copyright: string;
    };
  };
  demos: {
    flashcard: {
      setId: string;
      userId: string;
      cards: {
        id: string;
        front: string;
        back: string;
        tag: string;
        nextUp: string;
      }[];
      sessionLabel: string;
      controls: {
        previous: string;
        next: string;
        flip: string;
        front: string;
      };
      hint: string;
    };
    organization: {
      sets: {
        title: string;
        description: string;
        cards: number;
        reviews: number;
        created: string;
      }[];
      labels: {
        cards: string;
        reviews: string;
        created: string;
      };
      buttons: {
        study: string;
      };
    };
    progress: {
      stats: { label: string; value: string }[];
      recentActivity: {
        eyebrow: string;
        title: string;
        description: string;
        mostRecentLabel: string;
        mostRecentName: string;
        mostRecentCount: string;
        lastStudiedLabel: string;
        lastStudiedValue: string;
        resumeCta: string;
      };
    };
  };
};

export const marketingCopy: MarketingCopy = {
  header: {
    ariaLabel: "Verto home",
    nav: [
      { href: "#features", label: "Features" },
      { href: "#study-loop", label: "Study Loop" },
      { href: "#how-it-works", label: "Why Verto" },
      { href: "#get-started", label: "Get Started" },
    ],
    auth: {
      signIn: "Sign In",
      getStarted: "Get Started",
    },
  },
  hero: {
    badge: "Built for deep focus study",
    title: "Study with focus and momentum",
    description:
      "Verto helps you organize focused sets and run simple, repeatable study sessions. Review at your pace and pick up where you left off.",
    primaryCta: "Create Free Account",
    secondaryCta: "View features",
  },
  features: {
    eyebrow: "Core features",
    title: "Everything you need for focused study",
    description:
      "A clear workflow for creating sets, studying, and checking your progress without extra noise.",
    blocks: [
      {
        id: "study-session",
        eyebrow: "Study session",
        title: "A focused study flow",
        paragraphs: [
          "Flip through cards with clear focus states, quick actions, and a layout that keeps you in momentum. Every screen is designed to minimize friction and keep the next step obvious.",
          "The session UI mirrors the real study experience, so what you see here is what you get when you are in the app.",
        ],
        points: [
          "Flip cards with tap or keyboard shortcuts",
          "Shuffle cards or filter to starred cards",
          "Resume where you left off in a session",
        ],
        layout: "media-left",
        divider: "none",
        spacing: "mb-36 lg:mb-40 pt-16",
        media: "flashcard",
      },
      {
        id: "progress",
        eyebrow: "Dashboard",
        title: "Progress that matches the app",
        paragraphs: [
          "Track cards studied, session volume, and daily goals using the same stat cards and activity summaries found in the dashboard. It is a direct reflection of the product surface.",
          "The layout stays familiar between the product and the marketing page, so the experience feels consistent.",
        ],
        points: [
          "Cards studied and session totals",
          "Daily goal card count",
          "Recent set and last studied",
        ],
        layout: "media-right",
        divider: "top",
        spacing: "mb-36 lg:mb-40 pt-16",
        media: "progress",
      },
      {
        id: "organization",
        eyebrow: "Sets library",
        title: "A library that looks like your library",
        paragraphs: [
          "The marketing preview mirrors the actual set cards, from the left accent bar to the study/edit controls. It is the same layout, just focused for a quick scan.",
          "The preview mirrors the product layout, so the library feels familiar from the start.",
        ],
        points: [
          "Create and organize sets in a clean library",
          "Study or edit a set from its card",
          "Star cards and filter favorites",
        ],
        layout: "media-left",
        divider: "top",
        spacing: "pt-16",
        media: "organization",
      },
    ],
  },
  studyLoop: {
    eyebrow: "The study loop",
    title: "From sets to sessions in five clear steps",
    description:
      "Keep your learning structured without losing momentum. Each step tightens the feedback loop between what you know and what you need next.",
    steps: [
      {
        title: "Create a focused set",
        description:
          "Group what matters. Keep sets tight, scoped, and easy to revisit later.",
      },
      {
        title: "Add the key cards",
        description:
          "Capture definitions, concepts, and prompts that you want to recall.",
      },
      {
        title: "Start a study session",
        description:
          "Flip through cards quickly and keep the next prompt in focus.",
      },
      {
        title: "Recall before you reveal",
        description:
          "Answer from memory first, then check the back to reinforce it.",
      },
      {
        title: "Come back and repeat",
        description:
          "Short, consistent sessions help you keep momentum over time.",
      },
    ],
  },
  benefits: {
    eyebrow: "Why Verto",
    title: "A focus-first way to study",
    description:
      "Verto is built around recall-first practice and steady review, so sessions feel focused and easy to repeat.",
    items: [
      {
        title: "Recall-first practice",
        description: "Practice retrieving answers before revealing them.",
        evidenceLabel: "Principle",
        evidenceTitle: "Active recall is a common study technique",
        evidenceText:
          "Testing yourself can highlight what you know and what needs another pass.",
        layout: "wide",
      },
      {
        title: "Steady review",
        description: "Short, repeatable sessions make it easier to return.",
        evidenceLabel: "Principle",
        evidenceTitle: "Spacing reviews over time",
        evidenceText:
          "Revisiting material in smaller intervals can support consistency.",
        layout: "narrow",
      },
      {
        title: "Focused sessions",
        description: "Keep attention on a small set of cards at a time.",
        evidenceLabel: "Principle",
        evidenceTitle: "Smaller batches reduce overload",
        evidenceText:
          "Working in smaller chunks can make sessions easier to finish.",
        layout: "narrow",
      },
      {
        title: "Flexible pacing",
        description: "Study in quick bursts or longer sessions when you have time.",
        evidenceLabel: "Principle",
        evidenceTitle: "Short sessions still move you forward",
        evidenceText:
          "Even brief reviews can keep momentum between longer sessions.",
        layout: "wide",
      },
    ],
  },
  cta: {
    title: "Build your next study session",
    description:
      "Built for students, professionals, and lifelong learners who want a simple, consistent study flow.",
    primaryCta: "Create Free Account",
    secondaryCta: "Sign In",
    footer: {
      copyright: "© 2026 All rights reserved",
    },
  },
  demos: {
    flashcard: {
      setId: "demo-set-1",
      userId: "demo-user",
      cards: [
        {
          id: "demo-flashcard-1",
          front: "What is spaced review?",
          back: "A study technique that revisits material over time.",
          tag: "Memory",
          nextUp: "Active recall",
        },
        {
          id: "demo-flashcard-2",
          front: "What is active recall?",
          back: "Retrieving information before checking the answer.",
          tag: "Recall",
          nextUp: "Short sessions",
        },
        {
          id: "demo-flashcard-3",
          front: "Why use short sessions?",
          back: "Short sessions can make it easier to return regularly.",
          tag: "Strategy",
          nextUp: "Keep momentum",
        },
      ],
      sessionLabel: "Study session",
      controls: {
        previous: "Previous",
        next: "Next",
        flip: "Flip",
        front: "Front",
      },
      hint: "Click the card to flip or use the session controls.",
    },
    organization: {
      sets: [
        {
          title: "Cognitive Psychology Essentials",
          description:
            "Retrieval practice, spacing effect, encoding specificity.",
          cards: 28,
          reviews: 6,
          created: "Jan 12",
        },
        {
          title: "Neuroscience Foundations",
          description: "Neurons, synapses, and brain systems for learning.",
          cards: 34,
          reviews: 4,
          created: "Jan 28",
        },
        {
          title: "Behavioral Economics Toolkit",
          description: "Biases, nudges, and decision frameworks in practice.",
          cards: 22,
          reviews: 5,
          created: "Feb 02",
        },
      ],
      labels: {
        cards: "cards",
        reviews: "reviews",
        created: "Created",
      },
      buttons: {
        study: "Study",
      },
    },
    progress: {
      stats: [
        { label: "Cards studied", value: "247" },
        { label: "Study sessions", value: "18" },
        { label: "Daily goal", value: "20 cards" },
      ],
      recentActivity: {
        eyebrow: "Recent activity",
        title: "Keep track of your latest set",
        description: "Most recent sets and study status",
        mostRecentLabel: "Most recent set",
        mostRecentName: "Cognitive Psychology Essentials",
        mostRecentCount: "28 cards",
        lastStudiedLabel: "Last studied",
        lastStudiedValue: "Feb 5, 2026",
        resumeCta: "Resume session",
      },
    },
  },
};

export const studySteps = marketingCopy.studyLoop.steps;
export const benefits = marketingCopy.benefits.items;
export const featureBlocks = marketingCopy.features.blocks;
