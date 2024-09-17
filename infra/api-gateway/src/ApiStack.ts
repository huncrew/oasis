import { Stack, StackProps, Fn } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  LambdaIntegration,
  RestApi,
  Cors,
  IRestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda';

export interface ApiStackProps extends StackProps {
  apigwLambda: string;
}

export class ApiStack extends Stack {
  public readonly api: IRestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Create the API Gateway REST API with CORS enabled
    this.api = new RestApi(this, 'Endpoint', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Job-Id', 'X-User-Id'],
      },
    });

    // Import Lambda function constructs from the provided ARNs without modifying permissions
    const importLambda = (id: string, arn: string) => {
      return Function.fromFunctionAttributes(this, id, {
        functionArn: arn,
        skipPermissions: true, // The permissions are assumed to be set up in the Lambda stack
      });
    };

    // Import the Lambda functions
    const authHandler = importLambda('ApigwLambda', props.apigwLambda);


    // stripe
    const stepCreateResource = this.api.root.addResource('stripe-checkout');
    
    stepCreateResource.addMethod(
      'POST',
      new LambdaIntegration(authHandler),
    );

    // post csv
    const postCsv = this.api.root.addResource('upload-csv');
    
    postCsv.addMethod(
      'POST',
      new LambdaIntegration(authHandler),
    );

    // get jobs list
    const jobs = this.api.root.addResource('jobs');

    jobs.addMethod(
      'GET',
      new LambdaIntegration(authHandler),
    );

    // get latest job for analysis
    const latestJob = this.api.root.addResource('latest-job');

    latestJob.addMethod(
      'GET',
      new LambdaIntegration(authHandler),
    );

    // // STEP STATUS CHECK
    // const stepStatusCheckResource =
    //   this.api.root.addResource('step-status-check');

    // const sessionResource = stepStatusCheckResource
    //   .addResource('{sessionId}')
    //   .addResource('{taskId}');
    // sessionResource.addMethod(
    //   'GET',
    //   new LambdaIntegration(stepStatusCheckHandler),
    // );

    // // GENERATE AI
    // const generateAIResource = this.api.root.addResource('generate-ai');
    // generateAIResource.addMethod(
    //   'POST',
    //   new LambdaIntegration(generateAIHandler),
    // );
  }
}
