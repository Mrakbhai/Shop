export const THEMES = {
  light: {
    name: 'Classic Light',
    bodyClasses: 'light bg-gradient-to-br from-blue-50 to-white text-slate-900',
    headerClasses: 'bg-white border-b border-slate-200 shadow-sm',
    accentColor: '#3B82F6',
    backgroundPreview: '#EFF6FF',
    borderColor: '#E2E8F0',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    cardClass: 'bg-white border border-slate-200 shadow-sm',
    fontFamily: 'font-sans',
    headingClass: 'text-blue-950 font-semibold',
    inputClass: 'bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500',
    textClass: 'text-slate-900',
    mutedTextClass: 'text-slate-500',
    linkClass: 'text-blue-600 hover:text-blue-800',
    primaryColor: '#3B82F6',
    secondaryColor: '#f8fafc'
  },
  dark: {
    name: 'Dark Mode',
    bodyClasses: 'dark bg-slate-900 text-white',
    headerClasses: 'bg-slate-900 border-b border-slate-700 shadow-md',
    accentColor: '#3b82f6',
    backgroundPreview: '#0f172a',
    borderColor: '#334155',
    buttonClass: 'bg-gradient-to-r from-blue-600 to-blue-400 hover:brightness-110 text-white',
    cardClass: 'bg-slate-800 border border-slate-700 shadow-md rounded-xl',
    fontFamily: 'font-sans',
    headingClass: 'text-white font-semibold',
    inputClass: 'bg-slate-900 border-slate-700 text-white focus:border-blue-500 focus:ring-blue-500',
    textClass: 'text-slate-300',
    mutedTextClass: 'text-slate-400',
    linkClass: 'text-blue-400 hover:text-blue-300 transition-colors',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b'
  },
  premium: {
    name: 'Luxury Theme',
    bodyClasses: 'premium bg-slate-900 text-white',
    headerClasses: 'bg-slate-900 border-b border-slate-700 shadow-lg',
    accentColor: '#f59e0b',
    backgroundPreview: '#0f172a',
    borderColor: '#334155',
    buttonClass: 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 font-semibold hover:brightness-110 transition-all shadow-md',
    cardClass: 'bg-slate-800 border border-slate-700 shadow-xl shadow-slate-900/50 rounded-xl',
    fontFamily: 'font-sans',
    headingClass: 'text-white font-semibold',
    inputClass: 'bg-slate-900 border-slate-700 text-white focus:border-amber-500 focus:ring-amber-500',
    textClass: 'text-slate-300',
    mutedTextClass: 'text-slate-400',
    linkClass: 'text-yellow-400 hover:text-yellow-300 transition-colors',
    primaryColor: '#f59e0b',
    secondaryColor: '#1e293b'
  },

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
