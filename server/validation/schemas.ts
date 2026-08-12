import { z } from 'zod';

/**
 * Validation Schemas using Zod
 * Provides runtime validation and TypeScript type inference
 */

// Common schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

// Business schemas
export const businessTypeSchema = z.enum([
  'private_limited',
  'public_limited',
  'llp',
  'partnership',
  'sole_proprietorship',
  'opc',
]);

export const directorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits').optional(),
  designation: z.string().min(2).optional(),
  sharePercentage: z.number().min(0).max(100).optional(),
});

export const createBusinessSchema = z.object({
  name: z.string().min(3, 'Business name must be at least 3 characters'),
  type: businessTypeSchema,
  registrationNumber: z.string().optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format').optional(),
  gstNumber: z.string().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST format').optional(),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  address: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
  }),
  directors: z.array(directorSchema).min(1, 'At least one director required'),
});

export const updateBusinessSchema = createBusinessSchema.partial();

// Consultation schemas
export const createConsultationSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  date: z.string().datetime('Invalid date format'),
  timeSlot: z.string(),
  type: z.enum(['initial', 'follow_up', 'document_review']),
  notes: z.string().max(1000).optional(),
});

// Document upload schema
export const uploadDocumentSchema = z.object({
  documentType: z.enum([
    'pan_card',
    'aadhar_card',
    'address_proof',
    'bank_statement',
    'incorporation_certificate',
    'moa_aoa',
    'board_resolution',
    'gst_certificate',
    'other',
  ]),
  description: z.string().max(500).optional(),
});

// Type exports
export type Pagination = z.infer<typeof paginationSchema>;
export type CreateBusiness = z.infer<typeof createBusinessSchema>;
export type UpdateBusiness = z.infer<typeof updateBusinessSchema>;
export type CreateConsultation = z.infer<typeof createConsultationSchema>;
export type UploadDocument = z.infer<typeof uploadDocumentSchema>;
export type Director = z.infer<typeof directorSchema>;
