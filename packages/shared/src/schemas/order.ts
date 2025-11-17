import { z } from 'zod';

export const OrderItemSchema = z.object({
  menuItemId: z.string(),
  qty: z.number().int().min(1)
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  tableId: z.string(),
  items: z.array(OrderItemSchema),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type Order = z.infer<typeof OrderSchema>;
