import { LEAD_STATUSES, LeadStatus } from '../models/lead.js';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Status transition rules
const STATUS_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  pending: ['contacted', 'rejected'],
  contacted: ['qualified', 'rejected'],
  qualified: ['rejected'],
  rejected: [],
};

export const validateCreateLead = (body: Record<string, unknown>): ValidationResult => {
  const errors: string[] = [];

  if (!body.nama || typeof body.nama !== 'string' || (body.nama as string).trim() === '') {
    errors.push('nama is required and must be a non-empty string');
  }

  if (!body.kontak || typeof body.kontak !== 'string' || (body.kontak as string).trim() === '') {
    errors.push('kontak is required and must be a non-empty string');
  }

  if (!body.caseType || typeof body.caseType !== 'string') {
    errors.push('caseType is required and must be a string');
  }

  if (!body.description || typeof body.description !== 'string') {
    errors.push('description is required and must be a string');
  }

  if (!body.source || typeof body.source !== 'string') {
    errors.push('source is required and must be a string');
  }

  // Length validations
  if (body.nama && typeof body.nama === 'string' && body.nama.length > 100) {
    errors.push('nama must not exceed 100 characters');
  }

  if (body.description && typeof body.description === 'string' && body.description.length > 2000) {
    errors.push('description must not exceed 2000 characters');
  }

  return { valid: errors.length === 0, errors };
};

export const validateStatusUpdate = (
  currentStatus: LeadStatus,
  newStatus: string
): ValidationResult => {
  const errors: string[] = [];

  if (!LEAD_STATUSES.includes(newStatus as LeadStatus)) {
    errors.push(`Invalid status. Must be one of: ${LEAD_STATUSES.join(', ')}`);
    return { valid: false, errors };
  }

  const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
  if (!allowedTransitions.includes(newStatus as LeadStatus)) {
    errors.push(
      `Invalid status transition from '${currentStatus}' to '${newStatus}'. ` +
        `Allowed: ${allowedTransitions.join(', ') || 'none'}`
    );
  }

  return { valid: errors.length === 0, errors };
};
