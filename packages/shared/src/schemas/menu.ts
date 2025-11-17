import { z } from 'zod';

/**
 * Menu shared schema
 *
 * - priceCents: integer (amount in cents) to avoid floating point precision issues
 * - tastes / ingredients: array of localized strings { zh, en, de } for UI rendering
 * - translations: richer per-locale strings (name, shortDescription, detailedDescription)
 *
 * NOTE: Keep structure stable - front-end and back-end should import these types directly.
 */

/** Localized string for small labels (tastes, ingredients) */
export const LocalizedString = z.object({
  zh: z.string(),
  en: z.string(),
  de: z.string().optional(),
});

export type LocalizedString = z.infer<typeof LocalizedString>;

/** Translations block for human-readable text */
export const MenuItemTranslationSchema = z.object({
  name: z.string(),
  shortDescription: z.string().optional(),
  detailedDescription: z.string().optional(),
});

export type MenuItemTranslation = z.infer<typeof MenuItemTranslationSchema>;

/** Main Menu Item schema */
export const MenuItemSchema = z.object({
  id: z.string(),
  category: z.enum(['sichuan', 'xian']),
  priceCents: z.number().int().nonnegative(),
  tastes: z.array(LocalizedString).optional(),
  ingredients: z.array(LocalizedString).optional(),
  thumbnailUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  featured: z.boolean().optional(),
  translations: z.object({
    zh: MenuItemTranslationSchema,
    en: MenuItemTranslationSchema,
    de: MenuItemTranslationSchema.optional(),
  }),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

export const MenuSchema = z.array(MenuItemSchema);
export type Menu = z.infer<typeof MenuSchema>;
