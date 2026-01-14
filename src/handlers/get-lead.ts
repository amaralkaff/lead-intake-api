import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LeadService } from '../services/lead-service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { NotFoundError } from '../utils/errors.js';

const leadService = new LeadService();

export const getLead = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const leadId = event.pathParameters?.id;

  if (!leadId) {
    return errorResponse(400, 'VALIDATION_ERROR', 'Lead ID is required');
  }

  try {
    const lead = await leadService.getById(leadId);
    return successResponse(200, lead);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return errorResponse(404, 'NOT_FOUND', error.message);
    }
    throw error;
  }
};
