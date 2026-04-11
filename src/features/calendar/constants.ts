export const monthHeroImages = [
  "https://images.unsplash.com/photo-1457269449834-928af64c684d?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=1800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?q=80&w=1800&auto=format&fit=crop",
];

export const heroPlaces = [
  { location: "Banff, Canada", title: "Pine Valley Outlook" },
  { location: "Zermatt, Switzerland", title: "Alpine Snow Trail" },
  { location: "Milford Sound, New Zealand", title: "Mountain Bridge Trail" },
  { location: "Manali, India", title: "Highland River Pass" },
  { location: "Hallstatt, Austria", title: "Lakeside Ridge Walk" },
  { location: "Kashmir, India", title: "Valley Bloom Route" },
  { location: "Dolomites, Italy", title: "Sunrise Cliff Path" },
  { location: "Ladakh, India", title: "Golden Plateau View" },
  { location: "Sapa, Vietnam", title: "Cloud Terrace Trek" },
  { location: "Interlaken, Switzerland", title: "Glacier Lake Circuit" },
  { location: "Queenstown, New Zealand", title: "Forest Edge Loop" },
  { location: "Himachal, India", title: "Winter Ridge Trail" },
];

export const fallbackHeroImage =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1800&auto=format&fit=crop";

export type MonthTheme = {
  primaryColor: string;
  lightColor: string;
  textColor: string;
  accentColor: string;
};

export const monthThemes: MonthTheme[] = [
  { primaryColor: "#1E40AF", lightColor: "#EFF6FF", textColor: "#1E3A8A", accentColor: "#2563EB" },
  { primaryColor: "#9D174D", lightColor: "#FFF0F6", textColor: "#831843", accentColor: "#BE185D" },
  { primaryColor: "#0369A1", lightColor: "#F0F9FF", textColor: "#0C4A6E", accentColor: "#0284C7" },
  { primaryColor: "#065F46", lightColor: "#ECFDF5", textColor: "#064E3B", accentColor: "#0F766E" },
  { primaryColor: "#0F766E", lightColor: "#F0FDFA", textColor: "#134E4A", accentColor: "#14B8A6" },
  { primaryColor: "#0E7490", lightColor: "#ECFEFF", textColor: "#155E75", accentColor: "#06B6D4" },
  { primaryColor: "#166534", lightColor: "#F0FDF4", textColor: "#14532D", accentColor: "#22C55E" },
  { primaryColor: "#B45309", lightColor: "#FFFBEB", textColor: "#92400E", accentColor: "#F59E0B" },
  { primaryColor: "#BE123C", lightColor: "#FFF1F2", textColor: "#9F1239", accentColor: "#E11D48" },
  { primaryColor: "#7C3AED", lightColor: "#F5F3FF", textColor: "#5B21B6", accentColor: "#8B5CF6" },
  { primaryColor: "#1D4ED8", lightColor: "#EFF6FF", textColor: "#1E3A8A", accentColor: "#3B82F6" },
  { primaryColor: "#0F766E", lightColor: "#F0FDFA", textColor: "#115E59", accentColor: "#14B8A6" },
];

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const quickEventTags = ["+Meeting", "+Vacation", "+Deadline", "+Birthday"];
