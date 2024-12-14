import { ApplicationResponse, ApplicationStatus } from '../types/application';

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL!;

const statusEmojis = {
  ACCEPT: '✅',
  REJECT: '❌',
  MAYBE: '🤔',
  NEEDS_REVIEW: '⚠️',
} as const;

const statusColors = {
  ACCEPT: 0x22c55e,
  REJECT: 0xef4444,
  MAYBE: 0xf59e0b,
  NEEDS_REVIEW: 0x3b82f6,
} as const;

export async function sendApplicationToDiscord(
  application: ApplicationResponse & {
    firstAnalysis: any;
    secondAnalysis: any;
    finalStatus: ApplicationStatus;
    needsManualReview: boolean;
  }
) {
  const embed = {
    title: '📝 New Application Processed',
    color: statusColors[application.finalStatus],
    fields: [
      {
        name: 'Candidate',
        value: application.candidateName,
        inline: true,
      },
      {
        name: 'Email',
        value: application.email,
        inline: true,
      },
      {
        name: 'Status',
        value: `${statusEmojis[application.finalStatus]} ${application.finalStatus.replace('_', ' ')}`,
        inline: true,
      },
      {
        name: 'Needs Manual Review',
        value: application.needsManualReview ? '⚠️ Yes' : '✅ No',
        inline: true,
      },
      {
        name: 'First Analysis',
        value: `**Status**: ${application.firstAnalysis.status}\n**Confidence**: ${Math.round(application.firstAnalysis.confidence * 100)}%\n**Reasoning**: ${application.firstAnalysis.reasoning}`,
      },
      {
        name: 'Second Analysis',
        value: `**Status**: ${application.secondAnalysis.status}\n**Confidence**: ${Math.round(application.secondAnalysis.confidence * 100)}%\n**Reasoning**: ${application.secondAnalysis.reasoning}`,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      embeds: [embed],
    }),
  });
} 