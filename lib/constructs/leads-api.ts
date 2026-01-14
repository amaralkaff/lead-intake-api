import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface LeadsApiProps {
  handler: lambda.IFunction;
}

export class LeadsApi extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: LeadsApiProps) {
    super(scope, id);

    this.api = new apigateway.RestApi(this, 'LeadsRestApi', {
      restApiName: 'Lead Intake API',
      description: 'API for managing sales leads',
      deployOptions: {
        stageName: 'v1',
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(props.handler);

    // /leads resource
    const leads = this.api.root.addResource('leads');
    leads.addMethod('POST', lambdaIntegration);  // POST /leads
    leads.addMethod('GET', lambdaIntegration);   // GET /leads?status=

    // /leads/{id} resource
    const leadById = leads.addResource('{id}');
    leadById.addMethod('GET', lambdaIntegration);   // GET /leads/{id}
    leadById.addMethod('PATCH', lambdaIntegration); // PATCH /leads/{id}
  }
}
