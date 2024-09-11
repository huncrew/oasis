import { dynamoDb } from '../../../../../../common-utils/dynamoClient';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

export const saveAnalysisResultToDatabase = async ({ jobId, userId, result }) => {
    const params = {
      TableName: 'ContextTable',
      Item: {
        PK: `JOB#${jobId}`,  // PK: Using jobId with a prefix to differentiate between other types of items if needed
        SK: `USER#${userId}`, // SK: Using userId with a prefix for clarity and querying
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

