export type ApplicationStatus = 'ACCEPT' | 'REJECT' | 'MAYBE' | 'NEEDS_REVIEW';

export interface ApplicationResponse {
  id: string;
  timestamp: string;
  candidateName: string;
  email: string;
  // Add other form fields as needed
  responses: Record<string, string>;
  
  // AI Analysis
  firstAnalysis?: {
    status: ApplicationStatus;
    confidence: number;
    reasoning: string;
  };
  secondAnalysis?: {
    status: ApplicationStatus;
    confidence: number;
    reasoning: string;
  };
  
  // Final determination
  finalStatus: ApplicationStatus;
  needsManualReview: boolean;
} 