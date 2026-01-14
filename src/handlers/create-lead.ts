import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { LeadService } from '../services/lead-service.js';
import { validateCreateLead } from '../validators/lead-validator.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { Lead } from '../models/lead.js';

const leadService = new LeadService();

export const createLead = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || '{}') as Record<string, unknown>;
    const validationResult = validateCreateLead(body);

    if (!validationResult.valid) {
      return errorResponse(400, 'VALIDATION_ERROR', validationResult.errors.join(', '));
    }

    const now = new Date().toISOString();
    const lead: Lead = {
      leadId: uuidv4(),
      nama: body.nama as string,
      kontak: body.kontak as string,
      caseType: body.caseType as string,
      description: body.description as string,
      source: body.source as string,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    await leadService.create(lead);

    return successResponse(201, lead);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON');
    }
    throw error;
  }
};
