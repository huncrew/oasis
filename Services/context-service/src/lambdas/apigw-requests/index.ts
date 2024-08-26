import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult, ALBEvent, ALBResult } from 'aws-lambda';
import middy from '@middy/core';
import httpRouterHandler, { Route } from '@middy/http-router';
import jsonBodyParser from '@middy/http-json-body-parser';
import { stripeHandler } from './handlers/stripe';
import { uploadCsvHandler } from './handlers/csvOpenAi';
// import { uploadCsvHandler } from './handlers/uploadCsvHandler';
// import { retrieveAnalysisHandler } from './handlers/retrieveAnalysisHandler';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Define routes
const routes: Route<APIGatewayProxyEvent | ALBEvent, APIGatewayProxyResult | ALBResult>[] = [
  {
    method: 'POST',
    path: '/stripe-checkout',
    handler: stripeHandler,
  },
  {
    method: 'POST',
    path: '/upload-csv',
    handler: uploadCsvHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/retrieve-analysis',
  //   handler: retrieveAnalysisHandler,
  // },
];

// Apply middleware and router
export const handler = middy()
  .handler(httpRouterHandler(routes))
  .use(jsonBodyParser());
