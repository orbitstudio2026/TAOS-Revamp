// Verbatim copy from thealchemyofsovereignty.com — do not edit wording.

export const toolkit = {
  pageTitle: "Healing Services & Modalities",
  eyebrow: "The Healing Toolkit",
  title: "Sacred Tools for Transformation",
  body: "Each session is thoughtfully woven with ancient and modern healing modalities — channeling universal energy to meet you exactly where your soul needs it most.",
  hint: "Tap any modality to explore — click the center to resume the orbit.",
  cta: "Explore a Session",
};

export type Category = "Mind" | "Spirit" | "Energy" | "Body" | "Practice" | "Resource";

export interface Modality {
  id: number;
  title: string;
  date: string;
  content: string;
  category: Category;
  relatedIds: number[];
  energy: number;
}

export const modalities: Modality[] = [
  { id: 1, title: "Mindset Reprogramming", date: "Foundational", content: "Rewire limiting beliefs and install new patterns of sovereign thinking.", category: "Mind", relatedIds: [2, 7], energy: 95 },
  { id: 2, title: "Hypnotherapy", date: "Subconscious", content: "Access the subconscious to release stored patterns and invite deep healing.", category: "Mind", relatedIds: [1, 8, 9], energy: 90 },
  { id: 3, title: "Akashic Records", date: "Soul Library", content: "Read the energetic archive of your soul's journey across lifetimes.", category: "Spirit", relatedIds: [8, 9], energy: 88 },
  { id: 4, title: "Reiki Healing", date: "Universal Energy", content: "Channel universal life-force energy to restore balance and flow.", category: "Energy", relatedIds: [10, 15], energy: 92 },
  { id: 5, title: "Breathwork", date: "Living Practice", content: "Use the breath as a bridge between body, mind, and spirit.", category: "Body", relatedIds: [11, 18], energy: 85 },
  { id: 6, title: "Intuitive Healing", date: "Inner Knowing", content: "Healing guided by intuitive insight tuned precisely to your needs.", category: "Spirit", relatedIds: [7, 10], energy: 80 },
  { id: 7, title: "Spiritual Healing", date: "Soul Level", content: "Address wounds at the soul level for profound transformation.", category: "Spirit", relatedIds: [1, 6], energy: 90 },
  { id: 8, title: "Past Life Regression", date: "Lifetimes", content: "Revisit past lives to understand and release karmic patterns.", category: "Spirit", relatedIds: [2, 3, 9], energy: 78 },
  { id: 9, title: "Inter-Life Regression", date: "Between Lives", content: "Explore the soul realm between incarnations for deeper purpose.", category: "Spirit", relatedIds: [3, 8], energy: 75 },
  { id: 10, title: "Energy Healing & Clearings", date: "Field Work", content: "Clear stagnant energy and restore your luminous field.", category: "Energy", relatedIds: [4, 6, 14], energy: 88 },
  { id: 11, title: "Heart Space Meditation", date: "Daily Practice", content: "Anchor into the heart's wisdom through guided meditation.", category: "Practice", relatedIds: [5, 17], energy: 82 },
  { id: 12, title: "Healing Library", date: "Resources", content: "A curated collection of texts and teachings to support your path.", category: "Resource", relatedIds: [13, 16], energy: 70 },
  { id: 13, title: "Healing Audio Records", date: "Sound", content: "Sound journeys and audio meditations attuned for deep healing.", category: "Resource", relatedIds: [12, 11], energy: 72 },
  { id: 14, title: "Crystal Healing", date: "Earth Allies", content: "Work with crystalline frequencies to amplify your healing.", category: "Energy", relatedIds: [4, 10], energy: 80 },
  { id: 15, title: "Reintegrating Soul Fragments", date: "Soul Retrieval", content: "Call back lost parts of self to restore wholeness.", category: "Spirit", relatedIds: [4, 7], energy: 86 },
  { id: 16, title: "Positive Affirmations", date: "Daily Practice", content: "Reshape inner dialogue with sovereign, life-affirming words.", category: "Practice", relatedIds: [1, 12], energy: 68 },
  { id: 17, title: "Mindfulness", date: "Present Moment", content: "Cultivate presence as the ground of all transformation.", category: "Practice", relatedIds: [11, 18], energy: 78 },
  { id: 18, title: "Energy Healing Exercises", date: "Embodied", content: "Active practices to circulate and refine your subtle energy.", category: "Energy", relatedIds: [5, 10, 17], energy: 76 },
];
