import OpenAI from 'openai';
import { ApplicationResponse, ApplicationStatus } from '../types/application';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface LLMResponse {
  status: ApplicationStatus;
  confidence: number;
  reasoning: string;
}

export async function analyzeApplication(
  application: ApplicationResponse,
  systemPrompt: string
): Promise<LLMResponse> {
  const prompt = formatApplicationForLLM(application);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0].message.content!);
  
  return {
    status: result.status,
    confidence: result.confidence,
    reasoning: result.reasoning,
  };
}

function formatApplicationForLLM(application: ApplicationResponse): string {
  return JSON.stringify({
    candidateName: application.candidateName,
    email: application.email,
    responses: application.responses,
  }, null, 2);
} 