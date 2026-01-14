import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { LeadsTable } from './constructs/leads-table.js';
import { LeadsLambda } from './constructs/leads-lambda.js';
import { LeadsApi } from './constructs/leads-api.js';

export class LeadIntakeApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const leadsTable = new LeadsTable(this, 'LeadsTable');

    // Lambda Function
    const leadsLambda = new LeadsLambda(this, 'LeadsLambda', {
      table: leadsTable.table,
    });

    // API Gateway
    const leadsApi = new LeadsApi(this, 'LeadsApi', {
      handler: leadsLambda.function,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: leadsApi.api.url,
      description: 'Lead Intake API endpoint URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: leadsTable.table.tableName,
      description: 'DynamoDB table name',
    });
  }
}
