export const THEMES = {
  light: {
    name: 'Classic Light',
    bodyClasses: 'light bg-white text-slate-900',
    headerClasses: 'bg-white border-b border-slate-200 shadow-sm',
    accentColor: '#3B82F6',
    backgroundPreview: '#FFFFFF',
    borderColor: '#E2E8F0',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    cardClass: 'bg-white border border-slate-200 shadow-sm',
    fontFamily: 'font-sans',
    headingClass: 'text-slate-900 font-semibold',
    inputClass: 'bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500',
    textClass: 'text-slate-900',
    mutedTextClass: 'text-slate-500',
    linkClass: 'text-blue-600 hover:text-blue-800',
    primaryColor: '#3B82F6',
    secondaryColor: '#f8fafc'
  },
  dark: {
    name: 'Dark Mode',
    bodyClasses: 'dark bg-zinc-900 text-zinc-50',
    headerClasses: 'bg-zinc-800 border-b border-zinc-700 shadow-md',
    accentColor: '#818CF8',
    backgroundPreview: '#18181B',
    borderColor: '#3F3F46',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    cardClass: 'bg-zinc-800 border border-zinc-700 shadow-md',
    fontFamily: 'font-sans',
    headingClass: 'text-white font-semibold',
    inputClass: 'bg-zinc-700 border-zinc-600 text-white focus:border-indigo-500 focus:ring-indigo-500',
    textClass: 'text-zinc-100',
    mutedTextClass: 'text-zinc-300',
    linkClass: 'text-indigo-400 hover:text-indigo-300',
    primaryColor: '#818CF8',
    secondaryColor: '#27272A'
  },
  premium: {
    name: 'Luxury Gold',
    bodyClasses: 'premium bg-gradient-to-br from-neutral-900 to-black text-amber-50',
    headerClasses: 'bg-black border-b border-amber-900/30 shadow-lg',
    accentColor: '#F59E0B',
    backgroundPreview: '#0a0908',
    borderColor: '#78350f',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white font-semibold',
    cardClass: 'backdrop-blur-sm bg-black/70 border border-amber-800/50 shadow-lg',
    fontFamily: 'font-serif',
    headingClass: 'text-amber-300 font-bold',
    inputClass: 'bg-neutral-800 border-amber-900 text-white focus:border-amber-500 focus:ring-amber-500',
    textClass: 'text-amber-50',
    mutedTextClass: 'text-amber-100/70',
    linkClass: 'text-amber-400 hover:text-amber-300',
    primaryColor: '#F59E0B',
    secondaryColor: '#111'
  },
  minimalist: {
    name: 'Clean Minimal',
    bodyClasses: 'minimalist bg-gray-50 text-gray-900',
    headerClasses: 'bg-white border-b border-gray-100',
    accentColor: '#171717',
    backgroundPreview: '#FAFAFA',
    borderColor: '#E5E5E5',
    buttonClass: 'bg-black hover:bg-gray-800 text-white',
    cardClass: 'bg-white shadow-sm',
    fontFamily: 'font-sans',
    headingClass: 'text-gray-900 font-medium',
    inputClass: 'bg-white border-gray-200 focus:border-gray-900 focus:ring-gray-900',
    textClass: 'text-gray-800',
    mutedTextClass: 'text-gray-500',
    linkClass: 'text-gray-900 hover:text-gray-700',
    primaryColor: '#171717',
    secondaryColor: '#fafafa'
  },
  colorful: {
    name: 'Vibrant Purple',
    bodyClasses: 'colorful bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-900',
    headerClasses: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-b border-purple-300 shadow-md',
    accentColor: '#D946EF',
    backgroundPreview: '#f5f3ff',
    borderColor: '#c4b5fd',
    buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
    cardClass: 'bg-white/90 border border-purple-200 shadow-md',
    fontFamily: 'font-sans',
    headingClass: 'text-purple-800 font-bold',
    inputClass: 'bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500',
    textClass: 'text-purple-900',
    mutedTextClass: 'text-purple-600',
    linkClass: 'text-pink-600 hover:text-pink-700',
    primaryColor: '#D946EF',
    secondaryColor: '#f5f3ff'
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
