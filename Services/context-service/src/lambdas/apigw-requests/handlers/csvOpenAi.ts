import { APIGatewayProxyHandler } from 'aws-lambda';
import { saveAnalysisResultToDatabase } from '../repository/saveAnalysisResultToDatabase'
import OpenAI from 'openai';
import { parse } from 'csv-parse/sync';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const uploadCsvHandler: APIGatewayProxyHandler = async (event) => {
  const jobId = event.headers['X-Job-Id'];
  const userId = event.headers['X-User-Id'];

  console.log(jobId, userId)

  const fileContent = Buffer.from(event.body || '', 'base64').toString('utf-8');


  // Parse the CSV content
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Combine all feedback into a single prompt
  const feedbackTexts = records.map(record => record.feedback).join('\n\n');

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
        content: `Here is a collection of customer feedback:\n\n${feedbackTexts}\n\nPlease analyze and summarize this feedback.`,
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
  };
};
