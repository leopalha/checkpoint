// Date Utilities

import { MATCH_CHAT_DURATION_DAYS } from '@checkpoint/types';

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'agora';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;

  return date.toLocaleDateString('pt-BR');
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getChatExpirationDate(matchRevealedAt: Date): Date {
  const expirationDate = new Date(matchRevealedAt);
  expirationDate.setDate(expirationDate.getDate() + MATCH_CHAT_DURATION_DAYS);
  return expirationDate;
}

export function getDaysUntilExpiration(expirationDate: Date): number {
  const now = new Date();
  const diffMs = expirationDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isExpired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}
