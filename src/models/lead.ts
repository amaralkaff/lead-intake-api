export const LEAD_STATUSES = ['pending', 'contacted', 'qualified', 'rejected'] as const;
export type LeadStatus = typeof LEAD_STATUSES[number];

export interface Lead {
  leadId: string;
  nama: string;
  kontak: string;
  caseType: string;
  description: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadInput {
  nama: string;
  kontak: string;
  caseType: string;
  description: string;
  source: string;
}

export interface UpdateLeadInput {
  status: LeadStatus;
}
