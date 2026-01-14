import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib/core';

export class LeadsTable extends Construct {
  public readonly table: dynamodb.TableV2;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.TableV2(this, 'LeadsTable', {
      tableName: 'Leads',
      partitionKey: {
        name: 'leadId',
        type: dynamodb.AttributeType.STRING,
      },
      billing: dynamodb.Billing.onDemand(),
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      globalSecondaryIndexes: [
        {
          indexName: 'StatusIndex',
          partitionKey: {
            name: 'status',
            type: dynamodb.AttributeType.STRING,
          },
          sortKey: {
            name: 'createdAt',
            type: dynamodb.AttributeType.STRING,
          },
        },
      ],
    });
  }
}
