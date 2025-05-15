export const THEMES = {
  light: {
    name: 'Light',
    bodyClasses: 'light bg-white text-slate-900',
    headerClasses: 'bg-white border-b border-slate-200',
    accentColor: '#3B82F6',
    backgroundPreview: '#FFFFFF',
    borderColor: '#E2E8F0'
  },
  dark: {
    name: 'Dark',
    bodyClasses: 'dark bg-slate-950 text-slate-50',
    headerClasses: 'bg-slate-900 border-b border-slate-800',
    accentColor: '#6366F1',
    backgroundPreview: '#020617',
    borderColor: '#1E293B'
  },
  premium: {
    name: 'Premium',
    bodyClasses: 'premium bg-zinc-900 text-zinc-50',
    headerClasses: 'bg-zinc-900 border-b border-zinc-800',
    accentColor: '#F59E0B',
    backgroundPreview: '#18181B',
    borderColor: '#27272A'
  },
  minimalist: {
    name: 'Minimalist',
    bodyClasses: 'minimalist bg-neutral-50 text-neutral-900',
    headerClasses: 'bg-neutral-50 border-b border-neutral-200',
    accentColor: '#171717',
    backgroundPreview: '#FAFAFA',
    borderColor: '#E5E5E5'
  },
  experimental: {
    name: 'Experimental',
    bodyClasses: 'experimental bg-indigo-950 text-indigo-50',
    headerClasses: 'bg-indigo-900 border-b border-indigo-800',
    accentColor: '#4F46E5',
    backgroundPreview: '#1E1B4B',
    borderColor: '#312E81'
  }
};

export const CATEGORIES = [
  { id: 'anime', name: 'Anime' },
  { id: 'motivational', name: 'Motivational' },
  { id: 'gym', name: 'Gym' },
  { id: 'sports', name: 'Sports/Athletics' },
  { id: 'funny', name: 'Funny' },
  { id: 'minimalist', name: 'Minimalist' },
  { id: 'aesthetic', name: 'Aesthetic' },
  { id: 'quotes', name: 'Quotes' },
  { id: 'abstract', name: 'Abstract Art' },
  { id: 'pop_culture', name: 'Trends/Pop Culture' },
  { id: 'festive', name: 'Festive/Special Occasions' },
  { id: 'custom', name: 'Custom' }
];

export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_COLORS = [
  { id: 'black', name: 'Black', hex: '#000000' },
  { id: 'white', name: 'White', hex: '#FFFFFF' },
  { id: 'gray', name: 'Gray', hex: '#808080' },
  { id: 'blue', name: 'Blue', hex: '#0000FF' },
  { id: 'red', name: 'Red', hex: '#FF0000' },
  { id: 'green', name: 'Green', hex: '#008000' },
  { id: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { id: 'purple', name: 'Purple', hex: '#800080' },
  { id: 'pink', name: 'Pink', hex: '#FFC0CB' }
];

export const SHIRT_MOCKUPS = [
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1',
  'https://images.unsplash.com/photo-1622445275463-afa2ab738c34',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5'
];
