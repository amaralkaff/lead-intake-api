import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LeadService } from '../services/lead-service.js';
import { validateStatusUpdate } from '../validators/lead-validator.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';
import { LeadStatus } from '../models/lead.js';

const leadService = new LeadService();

export const updateLead = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const leadId = event.pathParameters?.id;

  if (!leadId) {
    return errorResponse(400, 'VALIDATION_ERROR', 'Lead ID is required');
  }

  try {
    const body = JSON.parse(event.body || '{}') as Record<string, unknown>;
    const newStatus = body.status as string;

    if (!newStatus) {
      return errorResponse(400, 'VALIDATION_ERROR', 'status field is required');
    }

    // Get current lead to check status transition
    const currentLead = await leadService.getById(leadId);
    const validationResult = validateStatusUpdate(currentLead.status, newStatus);

    if (!validationResult.valid) {
      return errorResponse(400, 'INVALID_STATUS_TRANSITION', validationResult.errors.join(', '));
    }

    const updatedLead = await leadService.updateStatus(leadId, newStatus as LeadStatus);
    return successResponse(200, updatedLead);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(400, 'INVALID_JSON', 'Request body must be valid JSON');
    }
    if (error instanceof NotFoundError) {
      return errorResponse(404, 'NOT_FOUND', error.message);
    }
    throw error;
  }
};
