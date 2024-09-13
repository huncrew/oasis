import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveAnalysisResultToDatabase } from '../repository/saveAnalysisResultToDatabase'
import OpenAI from 'openai';
import { parse } from 'csv-parse/sync';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const uploadCsvHandler: APIGatewayProxyHandler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));


  console.log('event headers')
  console.log(event.headers)

  const jobId = event.headers['x-job-id'];
  const userId = event.headers['x-user-id'];

  console.log(jobId, userId)


  const fileContent = event.body

  console.log(fileContent);

  // Send a single prompt to OpenAI for a combined analysis
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that summarizes and analyzes customer feedback.',
      },
      {
        role: 'user',
        content: `Here is a collection of customer feedback:\n\n${fileContent}\n\nPlease analyze and summarize this feedback.`,
      },
    ],
  });

  const analysisResult = response.choices[0].message.content;

  // log the result to see cloud watch
  console.log('log the analysus', analysisResult)

  // Store the result in your database or return it
  await saveAnalysisResultToDatabase({ jobId, userId, result: analysisResult });

  return {
    statusCode: 202,
    body: JSON.stringify({ message: 'Processing started.', jobId }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // or specific origin
      "Access-Control-Allow-Headers": "Content-Type",      
    },
  };
};
