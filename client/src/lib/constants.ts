export const THEMES = {
  light: {
    name: 'Light',
    bodyClasses: 'light bg-white text-slate-900 font-sans',
    headerClasses: 'bg-white border-b border-slate-200 shadow-sm',
    accentColor: '#3B82F6',
    backgroundPreview: '#FFFFFF',
    borderColor: '#E2E8F0',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    cardClass: 'bg-white border border-slate-200 shadow-sm',
    fontFamily: 'font-sans',
    headingClass: 'text-slate-900 font-semibold',
    inputClass: 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
  },
  dark: {
    name: 'Dark',
    bodyClasses: 'dark bg-slate-950 text-slate-50 font-sans',
    headerClasses: 'bg-slate-900 border-b border-slate-800 shadow-md',
    accentColor: '#6366F1',
    backgroundPreview: '#020617',
    borderColor: '#1E293B',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    cardClass: 'bg-slate-900 border border-slate-800 shadow-md',
    fontFamily: 'font-sans',
    headingClass: 'text-white font-semibold',
    inputClass: 'bg-slate-800 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 text-white'
  },
  premium: {
    name: 'Premium',
    bodyClasses: 'premium bg-zinc-900 text-zinc-50 font-serif',
    headerClasses: 'bg-zinc-900 border-b border-zinc-800 shadow-lg',
    accentColor: '#F59E0B',
    backgroundPreview: '#18181B',
    borderColor: '#27272A',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    cardClass: 'bg-zinc-800 border border-zinc-700 shadow-lg',
    fontFamily: 'font-serif',
    headingClass: 'text-amber-300 font-bold',
    inputClass: 'bg-zinc-800 border-zinc-600 focus:border-amber-500 focus:ring-amber-500 text-white'
  },
  minimalist: {
    name: 'Minimalist',
    bodyClasses: 'minimalist bg-neutral-50 text-neutral-900 font-sans',
    headerClasses: 'bg-neutral-50 border-b border-neutral-200',
    accentColor: '#171717',
    backgroundPreview: '#FAFAFA',
    borderColor: '#E5E5E5',
    buttonClass: 'bg-black hover:bg-neutral-800 text-white',
    cardClass: 'bg-white border-none shadow-sm',
    fontFamily: 'font-sans',
    headingClass: 'text-neutral-900 font-medium',
    inputClass: 'border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900'
  },
  experimental: {
    name: 'Experimental',
    bodyClasses: 'experimental bg-indigo-950 text-indigo-50 font-sans',
    headerClasses: 'bg-indigo-900 border-b border-indigo-800 shadow-lg',
    accentColor: '#4F46E5',
    backgroundPreview: '#1E1B4B',
    borderColor: '#312E81',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    cardClass: 'bg-indigo-900 border border-indigo-800 shadow-lg',
    fontFamily: 'font-sans',
    headingClass: 'text-indigo-100 font-semibold',
    inputClass: 'bg-indigo-900 border-indigo-700 focus:border-indigo-400 focus:ring-indigo-400 text-white'
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
