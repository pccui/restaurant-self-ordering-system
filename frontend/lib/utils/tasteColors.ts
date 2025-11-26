/**
 * Taste color mapping for semantic color-coded badges
 * Includes accessibility icons for color-blind users
 */

interface TasteColorConfig {
  bgColor: string
  textColor: string
  icon: string
}

// Color-blind friendly palette with pastel backgrounds
const TASTE_COLOR_MAP: Record<string, TasteColorConfig> = {
  // Spicy characteristics - Red/Orange
  '麻辣': { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🌶️' },
  'hot': { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🌶️' },
  '辣': { bgColor: 'bg-orange-100', textColor: 'text-orange-800', icon: '🔥' },
  '香辣': { bgColor: 'bg-orange-100', textColor: 'text-orange-800', icon: '🔥' },
  'spicy': { bgColor: 'bg-orange-100', textColor: 'text-orange-800', icon: '🔥' },
  'numbing': { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🌶️' },

  // Savory characteristics - Green/Yellow
  '鲜香': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '✨' },
  'umami': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '✨' },
  '鲜': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '✨' },
  '咸鲜': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🧂' },
  '咸香': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🧂' },
  'savory': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '✨' },
  'aromatic': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '🌿' },
  'salty': { bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🧂' },

  // Sweet/Sour characteristics - Blue/Purple
  '酸甜': { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: '🍋' },
  'sweet': { bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '🍯' },
  'sour': { bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: '🍋' },
  '甜': { bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '🍯' },
  '微甜': { bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '🍯' },
  '甜而不腻': { bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '🍯' },

  // Texture characteristics - Brown/Amber
  '酥脆': { bgColor: 'bg-amber-100', textColor: 'text-amber-800', icon: '🥠' },
  'crispy': { bgColor: 'bg-amber-100', textColor: 'text-amber-800', icon: '🥠' },
  'tender': { bgColor: 'bg-stone-100', textColor: 'text-stone-800', icon: '🥢' },
  '软糯': { bgColor: 'bg-stone-100', textColor: 'text-stone-800', icon: '🥢' },
  '嫩': { bgColor: 'bg-stone-100', textColor: 'text-stone-800', icon: '🥢' },

  // Other characteristics - Neutral
  '鱼香': { bgColor: 'bg-pink-100', textColor: 'text-pink-800', icon: '🐟' },
  '干香': { bgColor: 'bg-amber-100', textColor: 'text-amber-800', icon: '🍂' },
  '醇厚': { bgColor: 'bg-brown-100', textColor: 'text-brown-800', icon: '🍵' },
  '清爽': { bgColor: 'bg-cyan-100', textColor: 'text-cyan-800', icon: '💧' },
  '麻味': { bgColor: 'bg-red-100', textColor: 'text-red-800', icon: '🌶️' },
  '微辣': { bgColor: 'bg-orange-50', textColor: 'text-orange-700', icon: '🔥' },
  '皮脆': { bgColor: 'bg-amber-100', textColor: 'text-amber-800', icon: '🥠' },
  'mellow': { bgColor: 'bg-brown-100', textColor: 'text-brown-800', icon: '🍵' },
  'refreshing': { bgColor: 'bg-cyan-100', textColor: 'text-cyan-800', icon: '💧' },
}

// Default colors for unknown tastes
const DEFAULT_COLOR: TasteColorConfig = {
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-800',
  icon: '🍽️'
}

/**
 * Get color classes for a taste characteristic
 * @param taste - The taste string (in any language)
 * @returns Tailwind color classes and icon
 */
export function getTasteColor(taste: string): TasteColorConfig {
  const normalized = taste.toLowerCase().trim()

  // Try exact match first
  if (TASTE_COLOR_MAP[normalized]) {
    return TASTE_COLOR_MAP[normalized]
  }

  // Try partial match for compound tastes
  for (const [key, config] of Object.entries(TASTE_COLOR_MAP)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return config
    }
  }

  return DEFAULT_COLOR
}

/**
 * Get icon for a taste characteristic
 * @param taste - The taste string (in any language)
 * @returns Emoji icon
 */
export function getTasteIcon(taste: string): string {
  return getTasteColor(taste).icon
}

/**
 * Get full Tailwind class string for a taste badge
 * @param taste - The taste string
 * @returns Complete className string
 */
export function getTasteBadgeClasses(taste: string): string {
  const { bgColor, textColor } = getTasteColor(taste)
  return `${bgColor} ${textColor} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium`
}
