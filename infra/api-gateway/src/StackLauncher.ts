import { App, Fn } from 'aws-cdk-lib';
import { ApiStack } from './ApiStack';

const app = new App();

// Instantiate other stacks and pass their Lambda ARNs
new ApiStack(app, 'ApiStack', {
  authHandlerArn: Fn.importValue('AuthService-EtsyInitiateHandlerArn'), // Matches 'EtsyCallBackHandler'
  authCallbackHandlerArn: Fn.importValue('AuthService-EtsyCallBackHandlerArn'), // Matches 'EtsyInitiateHandler'
  registrationArn: Fn.importValue('AuthService-RegistrationHandlerArn'), // Matches 'RegistrationHandler'
  loginArn: Fn.importValue('AuthService-SignInHandlerArn'), // Matches 'SignInHandler'
  verifyEmailArn: Fn.importValue('AuthService-VerifyEmailHandlerArn'),
  contextHandlerArn: Fn.importValue('ContextService-ContextHandlerArn'),
  stepCreateArn: Fn.importValue('ContextService-StepCreateArn'),
  stepStatusCheckArn: Fn.importValue('ContextService-StepStatusHandlerArn'),
  generateAIArn: Fn.importValue('ContextService-GenerateAIHandlerArn'),
});
