import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createLead } from './create-lead.js';
import { getLead } from './get-lead.js';
import { listLeads } from './list-leads.js';
import { updateLead } from './update-lead.js';
import { errorResponse } from '../utils/response.js';

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  const { httpMethod, resource } = event;

  console.log('Request:', JSON.stringify({ httpMethod, resource, path: event.path }));

  try {
    // Route: POST /leads
    if (httpMethod === 'POST' && resource === '/leads') {
      return await createLead(event);
    }

    // Route: GET /leads/{id}
    if (httpMethod === 'GET' && resource === '/leads/{id}') {
      return await getLead(event);
    }

    // Route: GET /leads
    if (httpMethod === 'GET' && resource === '/leads') {
      return await listLeads(event);
    }

    // Route: PATCH /leads/{id}
    if (httpMethod === 'PATCH' && resource === '/leads/{id}') {
      return await updateLead(event);
    }

    return errorResponse(404, 'NOT_FOUND', 'Route not found');
  } catch (error) {
    console.error('Unhandled error:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'Internal server error');
  }
};
