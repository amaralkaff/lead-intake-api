import { APIGatewayProxyResult } from 'aws-lambda';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

export const successResponse = <T>(
  statusCode: number,
  data: T
): APIGatewayProxyResult => ({
  statusCode,
  headers,
  body: JSON.stringify({
    success: true,
    data,
  } as ApiResponse<T>),
});

export const errorResponse = (
  statusCode: number,
  code: string,
  message: string
): APIGatewayProxyResult => ({
  statusCode,
  headers,
  body: JSON.stringify({
    success: false,
    error: { code, message },
  } as ApiResponse),
});
