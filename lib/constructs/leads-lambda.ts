import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Duration, RemovalPolicy } from 'aws-cdk-lib/core';
import * as path from 'path';

interface LeadsLambdaProps {
  table: dynamodb.TableV2;
}

export class LeadsLambda extends Construct {
  public readonly function: nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LeadsLambdaProps) {
    super(scope, id);

    const logGroup = new logs.LogGroup(this, 'LeadsHandlerLogGroup', {
      logGroupName: '/aws/lambda/lead-intake-handler',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.function = new nodejs.NodejsFunction(this, 'LeadsHandler', {
      functionName: 'lead-intake-handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler',
      entry: path.join(__dirname, '../../src/handlers/index.ts'),
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        TABLE_NAME: props.table.tableName,
        NODE_OPTIONS: '--enable-source-maps',
      },
      logGroup,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['@aws-sdk/*'],
        forceDockerBundling: false,
      },
    });

    // Grant DynamoDB permissions (least privilege)
    props.table.grantReadWriteData(this.function);
  }
}
