import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Lead, LeadStatus } from '../models/lead.js';
import { NotFoundError } from '../utils/errors.js';

export class LeadService {
  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDBClient({
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    this.tableName = process.env.TABLE_NAME || 'Leads';
  }

  async create(lead: Lead): Promise<Lead> {
    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(lead),
        ConditionExpression: 'attribute_not_exists(leadId)',
      })
    );
    return lead;
  }

  async getById(leadId: string): Promise<Lead> {
    const result = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall({ leadId }),
      })
    );

    if (!result.Item) {
      throw new NotFoundError('Lead', leadId);
    }

    return unmarshall(result.Item) as Lead;
  }

  async listByStatus(
    status: LeadStatus,
    limit: number = 20,
    lastKey?: string
  ): Promise<{ items: Lead[]; lastEvaluatedKey?: string; count: number }> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: marshall({ ':status': status }),
        Limit: limit,
        ScanIndexForward: false, // Most recent first
        ExclusiveStartKey: lastKey
          ? JSON.parse(Buffer.from(lastKey, 'base64').toString())
          : undefined,
      })
    );

    const items = (result.Items || []).map((item) => unmarshall(item) as Lead);

    return {
      items,
      count: items.length,
      lastEvaluatedKey: result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
        : undefined,
    };
  }

  async updateStatus(leadId: string, newStatus: LeadStatus): Promise<Lead> {
    const result = await this.client.send(
      new UpdateItemCommand({
        TableName: this.tableName,
        Key: marshall({ leadId }),
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: marshall({
          ':status': newStatus,
          ':updatedAt': new Date().toISOString(),
        }),
        ConditionExpression: 'attribute_exists(leadId)',
        ReturnValues: 'ALL_NEW',
      })
    );

    if (!result.Attributes) {
      throw new NotFoundError('Lead', leadId);
    }

    return unmarshall(result.Attributes) as Lead;
  }
}
