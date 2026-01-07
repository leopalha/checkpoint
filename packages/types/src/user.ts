// User Types

export interface User {
  id: string;
  instagramId: string;
  instagramUsername: string;
  name: string;
  bio: string | null;
  profilePicture: string | null;
  defaultIntentions: InteractionType[];
  isPremium: boolean;
  dailyLikesRemaining: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  deletionScheduledAt: Date | null;
}

export interface UserProfile {
  id: string;
  name: string;
  instagramUsername: string;
  bio: string | null;
  profilePicture: string | null;
  defaultIntentions: InteractionType[];
  mutualFriends?: number;
  mutualEvents?: number;
}

export type InteractionType =
  | 'fire'        // Paquera
  | 'handshake'   // Networking
  | 'highfive'    // Amizade
  | 'carona'      // Carona
  | 'ticket'      // Ingresso sobrando
  | 'champagne'   // Drinks
  | 'briefcase'   // Business
  | 'target';     // Interesse específico

export interface CreateProfileDto {
  bio?: string;
  defaultIntentions: InteractionType[];
}

export interface UpdateProfileDto {
  bio?: string;
  defaultIntentions?: InteractionType[];
}
