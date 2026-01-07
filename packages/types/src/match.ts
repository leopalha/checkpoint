// Match Types

import { InteractionType } from './user';
import { ThemeId } from './theme';

export type MatchStatus = 'pending' | 'revealed' | 'expired';

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  eventId: string;
  interactionType: InteractionType;
  status: MatchStatus;
  revealedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface MatchSummary {
  id: string;
  otherUser: {
    id: string;
    name: string;
    instagramUsername: string;
    profilePicture: string | null;
  };
  event: {
    id: string;
    name: string;
    themeId: ThemeId;
  };
  interactionType: InteractionType;
  status: MatchStatus;
  revealedAt: Date | null;
  lastMessage: string | null;
  unreadCount: number;
  expiresAt: Date | null;
}

export const MATCH_CHAT_DURATION_DAYS = 7;
