// Interaction Types

import { InteractionType } from './user';

export interface Interaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  eventId: string;
  type: InteractionType;
  createdAt: Date;
}

export interface SendInteractionDto {
  toUserId: string;
  type: InteractionType;
}

export interface InteractionResponse {
  success: boolean;
  remainingLikes: number;
  isMatch: boolean;
  matchId?: string;
}

export const DAILY_LIKE_LIMIT_FREE = 10;
export const DAILY_LIKE_LIMIT_PREMIUM = 999;
export const EVENT_LIKE_LIMIT_FREE = 3;
