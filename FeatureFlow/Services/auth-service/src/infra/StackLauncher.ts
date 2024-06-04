import { App } from 'aws-cdk-lib';
import { LambdaStack } from '../infra/stacks/LambdaStack';
import { AuthStack } from '../infra/stacks/AuthStack';

import * as path from 'path';

const lambdasPath = path.join(__dirname, '..', 'lambdas');

const app = new App();

const authStack = new AuthStack(app, 'AuthStack');

new LambdaStack(app, 'LambdaStack', {
  lambdaCodePath: lambdasPath,
  userPoolClientId: authStack.userPoolClient.userPoolClientId,
});
