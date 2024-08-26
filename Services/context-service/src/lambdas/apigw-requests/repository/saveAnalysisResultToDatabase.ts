import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';


export const saveAnalysisResultToDatabase = async ({ jobId, userId, result }) => {
    const params = {
      TableName: 'ContextTable',
      Item: {
        JobId: jobId,
        UserId: userId,
        Result: result,
        CreatedAt: new Date().toISOString(),
      },
    };
  
    try {
      await dynamoDb.send(new PutCommand(params));
      console.log(`Successfully saved analysis result for JobId: ${jobId}`);
    } catch (error) {
      console.error('Error saving analysis result to DynamoDB:', error);
      throw new Error('Could not save analysis result to database');
    }
  };