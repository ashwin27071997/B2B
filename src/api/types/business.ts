// Business-related API types

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  registrationNumber?: string;
  status: BusinessStatus;
  createdAt: string;
  updatedAt: string;
}

export type BusinessType =
  | 'private_limited'
  | 'public_limited'
  | 'llp'
  | 'partnership'
  | 'sole_proprietorship'
  | 'opc';

export type BusinessStatus =
  | 'draft'
  | 'pending_documents'
  | 'under_review'
  | 'pending_approval'
  | 'approved'
  | 'rejected';

export interface CreateBusinessRequest {
  name: string;
  type: BusinessType;
  directors: Director[];
  registeredAddress: Address;
}

export interface Director {
  fullName: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar?: string;
  din?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface BusinessRegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedAt?: string;
}

export interface BusinessDocument {
  id: string;
  type: DocumentType;
  name: string;
  url?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  rejectionReason?: string;
}

export type DocumentType =
  | 'pan_card'
  | 'aadhaar_card'
  | 'address_proof'
  | 'photograph'
  | 'dsc'
  | 'incorporation_certificate'
  | 'moa_aoa';
