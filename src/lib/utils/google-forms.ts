import { google } from 'googleapis';
import { ApplicationResponse } from '../types/application';
import { randomUUID } from 'crypto';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
  scopes: ['https://www.googleapis.com/auth/forms.responses.readonly'],
});

const forms = google.forms({
  version: 'v1',
  auth,
});

export async function fetchFormResponses(formId: string): Promise<ApplicationResponse[]> {
  const response = await forms.forms.responses.list({
    formId,
  });

  if (!response.data.responses) {
    return [];
  }

  return Promise.all(
    response.data.responses.map((response) => parseFormResponse(response))
  );
}

export async function parseFormResponse(rawResponse: any): Promise<ApplicationResponse> {
  const answers = rawResponse.answers || {};
  const responses: Record<string, string> = {};

  // Map form question IDs to their answers
  Object.entries(answers).forEach(([questionId, answer]: [string, any]) => {
    responses[questionId] = answer.textAnswers?.answers?.[0]?.value || '';
  });

  return {
    id: randomUUID(),
    timestamp: rawResponse.createTime || new Date().toISOString(),
    candidateName: responses['name'] || 'Unknown',
    email: responses['email'] || 'unknown@example.com',
    responses,
    finalStatus: 'NEEDS_REVIEW',
    needsManualReview: true,
  };
} 