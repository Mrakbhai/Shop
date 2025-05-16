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
    bodyClasses: 'dark bg-[#0E1525] text-[#F5F9FC]',
    headerClasses: 'bg-[#1C2333] border-b border-[#2B3245] shadow-md',
    accentColor: '#3485e4',
    backgroundPreview: '#0E1525',
    borderColor: '#2B3245',
    buttonClass: 'bg-[#3485e4] hover:bg-[#2972d1] text-white',
    cardClass: 'bg-[#1C2333] border border-[#2B3245] shadow-md',
    fontFamily: 'font-sans',
    headingClass: 'text-[#F5F9FC] font-semibold',
    inputClass: 'bg-[#0E1525] border-[#2B3245] text-[#F5F9FC] focus:border-[#3485e4] focus:ring-[#3485e4]',
    textClass: 'text-[#F5F9FC]',
    mutedTextClass: 'text-[#A0AEC0]',
    linkClass: 'text-[#3485e4] hover:text-[#5a9cea]',
    primaryColor: '#3485e4',
    secondaryColor: '#1C2333'
  },
  premium: {
    name: 'Luxury Gold',
    bodyClasses: 'premium bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-900 to-black text-amber-50',
    headerClasses: 'bg-black border-b border-amber-900/30 shadow-lg backdrop-blur-md',
    accentColor: '#F59E0B',
    backgroundPreview: '#0a0908',
    borderColor: '#78350f',
    buttonClass: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold',
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
