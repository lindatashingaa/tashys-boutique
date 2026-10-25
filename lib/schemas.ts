import { z } from 'zod';

export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254), phone: z.string().trim().min(7).max(25), password: z.string().min(8).max(100) });
export const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(100) });
const productImageSchema = z.string().url().or(z.string().regex(/^\/images\/(?!.*\.\.)[A-Za-z0-9%._ -]+$/));
export const productSchema = z.object({ name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().min(10).max(2000), price: z.coerce.number().positive().max(100000), stock: z.coerce.number().int().min(0), imageUrl: z.array(productImageSchema).min(1).max(5), categoryId: z.string().min(1), isFeatured: z.boolean().default(false) });
export const categorySchema = z.object({ name: z.string().trim().min(2).max(80), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(500).optional().or(z.literal('')) });
export const cartSchema = z.object({ productId: z.string().min(1), quantity: z.coerce.number().int().min(1).max(20) });
export const shippingSchema = z.object({ fullName: z.string().trim().min(2).max(100), email: z.string().trim().email(), phone: z.string().trim().min(7).max(25), address: z.string().trim().min(5).max(250), city: z.string().trim().min(2).max(100) });