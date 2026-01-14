import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { LeadService } from '../services/lead-service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { LEAD_STATUSES, LeadStatus } from '../models/lead.js';

const leadService = new LeadService();

export const listLeads = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const status = event.queryStringParameters?.status;
  const limit = parseInt(event.queryStringParameters?.limit || '20', 10);
  const lastKey = event.queryStringParameters?.lastKey;

  if (!status) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      `status query parameter is required. Must be one of: ${LEAD_STATUSES.join(', ')}`
    );
  }

  if (!LEAD_STATUSES.includes(status as LeadStatus)) {
    return errorResponse(
      400,
      'VALIDATION_ERROR',
      `Invalid status. Must be one of: ${LEAD_STATUSES.join(', ')}`
    );
  }

  const result = await leadService.listByStatus(status as LeadStatus, limit, lastKey);
  return successResponse(200, result);
};
